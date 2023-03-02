import { BaseService } from './BaseService';
import { AuthService } from './AuthService';
import {
  OnCreateMessageSubscription,
  OnCreateConversationSubscription,
  OnUpdateConversationSubscription,
} from '../API';
import { GraphQLSubscription } from '@aws-amplify/api';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import {
  createConversation,
  createUserConversation,
  createMessage,
} from '../graphql/mutations';
import { AUTH_TYPE, AuthOptions } from 'aws-appsync-auth-link';
import AppSyncConfig from '../aws-exports';
import AWSAppSyncClient from 'aws-appsync';

const client = new AWSAppSyncClient({
  url: AppSyncConfig.aws_appsync_graphqlEndpoint,
  region: AppSyncConfig.aws_appsync_region,
  auth: {
    type: AppSyncConfig.aws_appsync_authenticationType as AUTH_TYPE,
    credentials: () => Auth.currentCredentials(),
    jwtToken: async () =>
      (await Auth.currentSession()).getAccessToken().getJwtToken()
  } as AuthOptions,
  complexObjectsCredentials: () => Auth.currentCredentials()
});

export class MessagingService extends BaseService {
  authService: AuthService;

  constructor() {
    super();

    this.authService = new AuthService();
  }

  getClient() {
    return client;
  }

  async getConversation(convoId: string) {
    const gql = `
      query  {
        getConversation(id: "${convoId}") {
          _version
          id
          userIds
          createdAt
          lastMessageCreatedAt
        }
      }
    `;
    //console.log('getConversation:gql', gql);
    let res: any = await API.graphql(graphqlOperation(gql));
    //console.log('getConversation:res', res);
    return res?.data?.getConversation;
  }

  async getUserConversation(convoId: string) {
    const userId = this.authService.getUserId();
    const gql = `
      query ListUserConversations($filter: ModelUserConversationFilterInput) {
        listUserConversations(filter: $filter) {
          items {
            _version
            id
            lastReadAt
            userId
            userConversationConversationId
          }
        }
      }
    `;
    const input = {
      userId: { eq: userId },
      userConversationConversationId: { eq: convoId },
    };
    //console.log('getUserConversation:gql', gql, input);
    let res: any = await API.graphql(graphqlOperation(gql, { filter: input }));
    //console.log('getUserConversation:res', res);
    const items = res?.data?.listUserConversations?.items;
    if (items.length > 1) {
      throw new Error('Invalid number of user conversations returned!');
    }
    return items[0];
  }

  async getOrCreateConversation(userIds: number | number[]) {
    const myUserId = this.authService.getUserId() || '';
    const theirUserIds = (Array.isArray(userIds) ? userIds : [userIds]).map(id => id.toString());
    const allUserIds = theirUserIds.concat([myUserId]);
    //console.log('myUserId', myUserId, 'theirUserIds', theirUserIds, 'allUserIds', allUserIds);

    const gql = `
      query  {
        listConversations(filter: {
          and: [` +
      allUserIds.map(id => `{ userIds: { contains: "${id}" } }`).join(',') + `],
        }) {
          startedAt
          nextToken

          items {
            id
            userIds
            createdAt
            lastMessageCreatedAt
            _version
          }
        }
      }
    `;
    //console.log('getOrCreateConversationWithUser:gql', gql);
    let res: any = await API.graphql(graphqlOperation(gql));
    //console.log('getOrCreateConversationWithUser:res', res);
    const list = res?.data?.listConversations?.items || [];
    //console.log('getOrCreateConversationWithUser:list', list);
    let convo: any = null;
    if (list.length) {
      convo = list.find((c: any) => {
        const userIds = (Array.isArray(c.userIds) ? c.userIds : JSON.parse(c.userIds));
        return userIds.length === allUserIds.length;
      });
      if (convo) {
        return convo;
      }
    }

    console.log('Creating conversation', allUserIds);

    const createConversationInput = {
      createdAt: new Date().getTime(),
      userIds: JSON.stringify(allUserIds),
    };

    //console.log('getOrCreateConversationWithUser:createConversationInput', createConversationInput);
    res = await API.graphql(graphqlOperation(createConversation, { input: createConversationInput }));
    //console.log('getOrCreateConversationWithUser:res', res);
    convo = res?.data?.createConversation;

    res = await Promise.all([
      allUserIds.map(id => {
        const createUserConversationInput = {
          userId: id,
          userConversationConversationId: convo.id,
        };
        return API.graphql(graphqlOperation(createUserConversation, { input: createUserConversationInput }));
      }),
    ]);
    //console.log('getOrCreateConversationWithUser:res', res);
    return convo;
  }

  //private async createUserConversation(userId: string, convoId: string) {
  //  const res: any = await API.graphql(graphqlOperation(createUserConversation, {
  //    input: {
  //      userConversationConversationId: convoId,
  //      userID: userId,
  //    }
  //  }));
  //  return res?.data?.createUserConversation;
  //}

  async markConversationRead(convoId: string, createdAt: number) {
    console.log('MessagingService.markUserConverationRead', convoId, createdAt);

    const userConvo: any = await this.getUserConversation(convoId);
    //console.log('markConversationRead:userConvo', userConvo);

    const updateUserConversationGQL = `
      mutation UpdateUserConversation($input: UpdateUserConversationInput!) {
        updateUserConversation(input: $input) {
          _version
          id
          lastReadAt
          userId
          userConversationConversationId
        }
      }
    `;
    userConvo.lastReadAt = createdAt;
    //console.log('updateUserConversationGQL', updateUserConversationGQL, userConvo/*, 'updateUserConversationInput', updateUserConversationInput*/);

    const res: any = await API.graphql(graphqlOperation(updateUserConversationGQL, { input: userConvo /*updateUserConversationInput*/ }));
    //console.log('markConversationRead:res', res);
    return res?.data?.updateUserConversation;
  }

  async createMessage(convoId: string, text: string, fileUrl: string, fileMimeType: string) {
    console.log('MessagingService.createMessage', convoId, text, fileUrl, fileMimeType);

    const createdAt = Math.floor(new Date().getTime() / 1000);
    const userId = this.authService.getUserId();

    const createMessageInput = {
      id: new Date().getTime().toString(),
      conversationId: convoId,
      userId,
      text: text.trim(),
      fileUrl,
      fileMimeType,
      createdAt,
    };
    //console.log('createMessageInput', createMessageInput);

    let res: any = await Promise.all([
      API.graphql(graphqlOperation(createMessage, { input: createMessageInput })),
      this.getConversation(convoId),
    ]);
    //console.log('createMessage:res', res);
    const msg = res[0]?.data?.createMessage;
    const convo = res[1];

    const updateConversationGQL = `
      mutation UpdateConversation($input: UpdateConversationInput!) {
        updateConversation(input: $input) {
          _version
          id
          createdAt
          userIds
          lastMessageCreatedAt
          lastMessageText
          lastMessageFileUrl
          lastMessageFileMimeType
          lastMessageUserId
        }
      }
    `;
    const updateConversationInput = {
      _version: convo._version,
      id: convo.id,
      lastMessageCreatedAt: createdAt,
      lastMessageText: text.trim(),
      lastMessageFileUrl: fileUrl,
      lastMessageFileMimeType: fileMimeType,
      lastMessageUserId: userId || '',
    };
    //console.log('updateConversationGQL', updateConversationGQL, 'updateConversationInput', updateConversationInput);

    res = await Promise.all([
      //API.graphql(graphqlOperation(updateUserConversationGQL, { input: updateUserConversationInput })),
      API.graphql(graphqlOperation(updateConversationGQL, { input: updateConversationInput })),
    ]);
    //console.log('createMessage:res', res);

    return msg;
  }

  async getMessages(convoId: string, nextToken: string = '', pageSize: number = 15) {
    const gql = `
      query {
        byConversation(
          conversationId: "${convoId}",
          sortDirection: DESC,
          limit: ${pageSize || 50},
          nextToken: ${nextToken ? '"' + nextToken + '"' : 'null'}
        ) {
          nextToken

          items {
            id
            text
            createdAt
            userId
            fileUrl
            fileMimeType
          }
        }
      }`;
    //console.log('getMessages:gql', gql);
    let res: any = await API.graphql(graphqlOperation(gql));
    //console.log('getMessages:res', res);
    const ret = res?.data?.byConversation || { items: [], nextToken: null };
    if (ret.items === null || ret.items === undefined) {
      ret.items = [];
    }
    return ret;
  }

  getNewMessages(convoId: string) {
    const gql = `
      subscription {
        onCreateMessage(filter: { conversationId: { eq: "${convoId}" } }) {
          id
          text
          createdAt
          userId
          fileUrl
          fileMimeType
        }
      }
    `;
    //console.log('getNewMessages:gql', gql);
    const res = API.graphql<GraphQLSubscription<OnCreateMessageSubscription>>(graphqlOperation(gql));
    return res.map(data => {
      //console.log('getNewMessages:map(data)', data);
      return data?.value?.data?.onCreateMessage;
    });
  }

  async getConversations() {
    const userId = this.authService.getUserId();
    const gql = `
      query ListUserConversations($filter: ModelUserConversationFilterInput) {
        listUserConversations(filter: $filter) {
          items {
            lastReadAt
            conversation {
              id
              createdAt
              userIds
              lastMessageCreatedAt
              lastMessageText
              lastMessageFileUrl
              lastMessageFileMimeType
              lastMessageUserId
            }
          }
        }
      }
    `;
    const input = {
      userId: { eq: userId },
    };
    //console.log('getUserConversation:gql', gql, input);
    let res: any = await API.graphql(graphqlOperation(gql, { filter: input }));
    //console.log('getUserConversation:res', res);
    const items = res?.data?.listUserConversations?.items;
    return items.map((uc: any) => {
      const convo = uc.conversation;
      convo.lastReadAt = uc.lastReadAt;
      return convo;
    });
  }

  getConversationUpdates(convoId: string) {
    const gql = `
      subscription {
        onUpdateConversation(filter: { id: { eq: "${convoId}" } }) {
          id
          userIds
          lastMessageCreatedAt
          lastMessageText
          lastMessageFileUrl
          lastMessageFileMimeType
          lastMessageUserId
        }
      }
    `;
    //console.log('getConversationUpdates:gql', gql);
    const res = API.graphql<GraphQLSubscription<OnUpdateConversationSubscription>>(graphqlOperation(gql));
    return res.map(data => {
      //console.log('getConversationUpdates:map(data)', data);
      return data?.value?.data?.onUpdateConversation;
    });
  }

  getConversationCreates() {
    const userId = this.authService.getUserId();
    const gql = `
      subscription {
        onCreateConversation(filter: { userIds: { contains: "${userId}" } }) {
          id
          userIds
          lastMessageCreatedAt
          lastMessageText
          lastMessageFileUrl
          lastMessageFileMimeType
          lastMessageUserId
        }
      }
    `;
    //console.log('getConversationCreates:gql', gql);
    const res = API.graphql<GraphQLSubscription<OnCreateConversationSubscription>>(graphqlOperation(gql));
    return res.map(data => {
      //console.log('getConversationCreates:map(data)', data);
      return data?.value?.data?.onCreateConversation;
    });
  }

  async uploadFile(convoId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    console.log('formData', formData, typeof formData);
    console.log(formData instanceof FormData);

    return await super.fetch('POST', `/upload/${convoId}/chat`, formData);
  }
}

