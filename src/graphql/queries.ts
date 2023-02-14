/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserConversation = /* GraphQL */ `
  query GetUserConversation($id: ID!) {
    getUserConversation(id: $id) {
      id
      lastReadAt
      conversation {
        id
        createdAt
        userIds
        lastMessageCreatedAt
        lastMessageText
        lastMessageFileUrl
        lastMessageFileUser
        lastMessageFileMimeType
        lastMessageUserId
        messages {
          nextToken
          startedAt
        }
        lastMessageFileType
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      userId
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userConversationConversationId
    }
  }
`;
export const listUserConversations = /* GraphQL */ `
  query ListUserConversations(
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserConversations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        lastReadAt
        conversation {
          id
          createdAt
          userIds
          lastMessageCreatedAt
          lastMessageText
          lastMessageFileUrl
          lastMessageFileUser
          lastMessageFileMimeType
          lastMessageUserId
          lastMessageFileType
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        userId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userConversationConversationId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUserConversations = /* GraphQL */ `
  query SyncUserConversations(
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUserConversations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        lastReadAt
        conversation {
          id
          createdAt
          userIds
          lastMessageCreatedAt
          lastMessageText
          lastMessageFileUrl
          lastMessageFileUser
          lastMessageFileMimeType
          lastMessageUserId
          lastMessageFileType
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        userId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userConversationConversationId
      }
      nextToken
      startedAt
    }
  }
`;
export const getConversation = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
      id
      createdAt
      userIds
      lastMessageCreatedAt
      lastMessageText
      lastMessageFileUrl
      lastMessageFileUser
      lastMessageFileMimeType
      lastMessageUserId
      messages {
        items {
          id
          conversationId
          text
          createdAt
          userId
          fileUrl
          fileMimeType
          updatedAt
          _version
          _deleted
          _lastChangedAt
          messageFileId
        }
        nextToken
        startedAt
      }
      lastMessageFileType
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listConversations = /* GraphQL */ `
  query ListConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConversations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        userIds
        lastMessageCreatedAt
        lastMessageText
        lastMessageFileUrl
        lastMessageFileUser
        lastMessageFileMimeType
        lastMessageUserId
        messages {
          nextToken
          startedAt
        }
        lastMessageFileType
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncConversations = /* GraphQL */ `
  query SyncConversations(
    $filter: ModelConversationFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncConversations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        createdAt
        userIds
        lastMessageCreatedAt
        lastMessageText
        lastMessageFileUrl
        lastMessageFileUser
        lastMessageFileMimeType
        lastMessageUserId
        messages {
          nextToken
          startedAt
        }
        lastMessageFileType
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      conversationId
      text
      createdAt
      userId
      fileUrl
      fileMimeType
      file {
        id
        bucket
        region
        key
        mimeType
        type
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      updatedAt
      _version
      _deleted
      _lastChangedAt
      messageFileId
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        conversationId
        text
        createdAt
        userId
        fileUrl
        fileMimeType
        file {
          id
          bucket
          region
          key
          mimeType
          type
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        updatedAt
        _version
        _deleted
        _lastChangedAt
        messageFileId
      }
      nextToken
      startedAt
    }
  }
`;
export const syncMessages = /* GraphQL */ `
  query SyncMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMessages(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        conversationId
        text
        createdAt
        userId
        fileUrl
        fileMimeType
        file {
          id
          bucket
          region
          key
          mimeType
          type
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        updatedAt
        _version
        _deleted
        _lastChangedAt
        messageFileId
      }
      nextToken
      startedAt
    }
  }
`;
export const getS3Object = /* GraphQL */ `
  query GetS3Object($id: ID!) {
    getS3Object(id: $id) {
      id
      bucket
      region
      key
      mimeType
      type
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const listS3Objects = /* GraphQL */ `
  query ListS3Objects(
    $filter: ModelS3ObjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listS3Objects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        bucket
        region
        key
        mimeType
        type
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncS3Objects = /* GraphQL */ `
  query SyncS3Objects(
    $filter: ModelS3ObjectFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncS3Objects(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        bucket
        region
        key
        mimeType
        type
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const userConversationByUserId = /* GraphQL */ `
  query UserConversationByUserId(
    $userId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserConversationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userConversationByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        lastReadAt
        conversation {
          id
          createdAt
          userIds
          lastMessageCreatedAt
          lastMessageText
          lastMessageFileUrl
          lastMessageFileUser
          lastMessageFileMimeType
          lastMessageUserId
          lastMessageFileType
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        userId
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userConversationConversationId
      }
      nextToken
      startedAt
    }
  }
`;
export const byConversation = /* GraphQL */ `
  query ByConversation(
    $conversationId: ID!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    byConversation(
      conversationId: $conversationId
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        conversationId
        text
        createdAt
        userId
        fileUrl
        fileMimeType
        file {
          id
          bucket
          region
          key
          mimeType
          type
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        updatedAt
        _version
        _deleted
        _lastChangedAt
        messageFileId
      }
      nextToken
      startedAt
    }
  }
`;
