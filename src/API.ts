/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserConversationInput = {
  id?: string | null,
  lastReadAt?: number | null,
  userId: string,
  _version?: number | null,
  userConversationConversationId: string,
};

export type ModelUserConversationConditionInput = {
  lastReadAt?: ModelIntInput | null,
  userId?: ModelStringInput | null,
  and?: Array< ModelUserConversationConditionInput | null > | null,
  or?: Array< ModelUserConversationConditionInput | null > | null,
  not?: ModelUserConversationConditionInput | null,
  userConversationConversationId?: ModelIDInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UserConversation = {
  __typename: "UserConversation",
  id: string,
  lastReadAt?: number | null,
  conversation: Conversation,
  userId: string,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  userConversationConversationId: string,
};

export type Conversation = {
  __typename: "Conversation",
  id: string,
  createdAt: number,
  userIds?: string | null,
  lastMessageCreatedAt?: number | null,
  lastMessageText?: string | null,
  lastMessageFileUrl?: string | null,
  lastMessageFileUser?: string | null,
  lastMessageFileMimeType?: string | null,
  lastMessageUserId?: string | null,
  messages?: ModelMessageConnection | null,
  lastMessageFileType?: string | null,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type ModelMessageConnection = {
  __typename: "ModelMessageConnection",
  items:  Array<Message | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type Message = {
  __typename: "Message",
  id: string,
  conversationId: string,
  text?: string | null,
  createdAt: number,
  userId: number,
  fileUrl?: string | null,
  fileMimeType?: string | null,
  file?: S3Object | null,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
  messageFileId?: string | null,
};

export type S3Object = {
  __typename: "S3Object",
  id: string,
  bucket: string,
  region: string,
  key: string,
  mimeType: string,
  type: string,
  createdAt: string,
  updatedAt: string,
  _version: number,
  _deleted?: boolean | null,
  _lastChangedAt: number,
};

export type UpdateUserConversationInput = {
  id: string,
  lastReadAt?: number | null,
  userId?: string | null,
  _version?: number | null,
  userConversationConversationId: string,
};

export type DeleteUserConversationInput = {
  id: string,
  _version?: number | null,
};

export type CreateConversationInput = {
  id?: string | null,
  createdAt: number,
  userIds?: string | null,
  lastMessageCreatedAt?: number | null,
  lastMessageText?: string | null,
  lastMessageFileUrl?: string | null,
  lastMessageFileUser?: string | null,
  lastMessageFileMimeType?: string | null,
  lastMessageUserId?: string | null,
  lastMessageFileType?: string | null,
  _version?: number | null,
};

export type ModelConversationConditionInput = {
  createdAt?: ModelIntInput | null,
  userIds?: ModelStringInput | null,
  lastMessageCreatedAt?: ModelIntInput | null,
  lastMessageText?: ModelStringInput | null,
  lastMessageFileUrl?: ModelStringInput | null,
  lastMessageFileUser?: ModelStringInput | null,
  lastMessageFileMimeType?: ModelStringInput | null,
  lastMessageUserId?: ModelStringInput | null,
  lastMessageFileType?: ModelStringInput | null,
  and?: Array< ModelConversationConditionInput | null > | null,
  or?: Array< ModelConversationConditionInput | null > | null,
  not?: ModelConversationConditionInput | null,
};

export type UpdateConversationInput = {
  id: string,
  createdAt?: number | null,
  userIds?: string | null,
  lastMessageCreatedAt?: number | null,
  lastMessageText?: string | null,
  lastMessageFileUrl?: string | null,
  lastMessageFileUser?: string | null,
  lastMessageFileMimeType?: string | null,
  lastMessageUserId?: string | null,
  lastMessageFileType?: string | null,
  _version?: number | null,
};

export type DeleteConversationInput = {
  id: string,
  _version?: number | null,
};

export type CreateMessageInput = {
  id?: string | null,
  conversationId: string,
  text?: string | null,
  createdAt: number,
  userId: number,
  fileUrl?: string | null,
  fileMimeType?: string | null,
  _version?: number | null,
  messageFileId?: string | null,
};

export type ModelMessageConditionInput = {
  conversationId?: ModelIDInput | null,
  text?: ModelStringInput | null,
  createdAt?: ModelIntInput | null,
  userId?: ModelIntInput | null,
  fileUrl?: ModelStringInput | null,
  fileMimeType?: ModelStringInput | null,
  and?: Array< ModelMessageConditionInput | null > | null,
  or?: Array< ModelMessageConditionInput | null > | null,
  not?: ModelMessageConditionInput | null,
  messageFileId?: ModelIDInput | null,
};

export type UpdateMessageInput = {
  id: string,
  conversationId?: string | null,
  text?: string | null,
  createdAt?: number | null,
  userId?: number | null,
  fileUrl?: string | null,
  fileMimeType?: string | null,
  _version?: number | null,
  messageFileId?: string | null,
};

export type DeleteMessageInput = {
  id: string,
  _version?: number | null,
};

export type CreateS3ObjectInput = {
  id?: string | null,
  bucket: string,
  region: string,
  key: string,
  mimeType: string,
  type: string,
  _version?: number | null,
};

export type ModelS3ObjectConditionInput = {
  bucket?: ModelStringInput | null,
  region?: ModelStringInput | null,
  key?: ModelStringInput | null,
  mimeType?: ModelStringInput | null,
  type?: ModelStringInput | null,
  and?: Array< ModelS3ObjectConditionInput | null > | null,
  or?: Array< ModelS3ObjectConditionInput | null > | null,
  not?: ModelS3ObjectConditionInput | null,
};

export type UpdateS3ObjectInput = {
  id: string,
  bucket?: string | null,
  region?: string | null,
  key?: string | null,
  mimeType?: string | null,
  type?: string | null,
  _version?: number | null,
};

export type DeleteS3ObjectInput = {
  id: string,
  _version?: number | null,
};

export type ModelUserConversationFilterInput = {
  id?: ModelIDInput | null,
  lastReadAt?: ModelIntInput | null,
  userId?: ModelStringInput | null,
  and?: Array< ModelUserConversationFilterInput | null > | null,
  or?: Array< ModelUserConversationFilterInput | null > | null,
  not?: ModelUserConversationFilterInput | null,
  userConversationConversationId?: ModelIDInput | null,
};

export type ModelUserConversationConnection = {
  __typename: "ModelUserConversationConnection",
  items:  Array<UserConversation | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelConversationFilterInput = {
  id?: ModelIDInput | null,
  createdAt?: ModelIntInput | null,
  userIds?: ModelStringInput | null,
  lastMessageCreatedAt?: ModelIntInput | null,
  lastMessageText?: ModelStringInput | null,
  lastMessageFileUrl?: ModelStringInput | null,
  lastMessageFileUser?: ModelStringInput | null,
  lastMessageFileMimeType?: ModelStringInput | null,
  lastMessageUserId?: ModelStringInput | null,
  lastMessageFileType?: ModelStringInput | null,
  and?: Array< ModelConversationFilterInput | null > | null,
  or?: Array< ModelConversationFilterInput | null > | null,
  not?: ModelConversationFilterInput | null,
};

export type ModelConversationConnection = {
  __typename: "ModelConversationConnection",
  items:  Array<Conversation | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelMessageFilterInput = {
  id?: ModelIDInput | null,
  conversationId?: ModelIDInput | null,
  text?: ModelStringInput | null,
  createdAt?: ModelIntInput | null,
  userId?: ModelIntInput | null,
  fileUrl?: ModelStringInput | null,
  fileMimeType?: ModelStringInput | null,
  and?: Array< ModelMessageFilterInput | null > | null,
  or?: Array< ModelMessageFilterInput | null > | null,
  not?: ModelMessageFilterInput | null,
  messageFileId?: ModelIDInput | null,
};

export type ModelS3ObjectFilterInput = {
  id?: ModelIDInput | null,
  bucket?: ModelStringInput | null,
  region?: ModelStringInput | null,
  key?: ModelStringInput | null,
  mimeType?: ModelStringInput | null,
  type?: ModelStringInput | null,
  and?: Array< ModelS3ObjectFilterInput | null > | null,
  or?: Array< ModelS3ObjectFilterInput | null > | null,
  not?: ModelS3ObjectFilterInput | null,
};

export type ModelS3ObjectConnection = {
  __typename: "ModelS3ObjectConnection",
  items:  Array<S3Object | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelIDKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelSubscriptionUserConversationFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  lastReadAt?: ModelSubscriptionIntInput | null,
  userId?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserConversationFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserConversationFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionConversationFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionIntInput | null,
  userIds?: ModelSubscriptionStringInput | null,
  lastMessageCreatedAt?: ModelSubscriptionIntInput | null,
  lastMessageText?: ModelSubscriptionStringInput | null,
  lastMessageFileUrl?: ModelSubscriptionStringInput | null,
  lastMessageFileUser?: ModelSubscriptionStringInput | null,
  lastMessageFileMimeType?: ModelSubscriptionStringInput | null,
  lastMessageUserId?: ModelSubscriptionStringInput | null,
  lastMessageFileType?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionConversationFilterInput | null > | null,
  or?: Array< ModelSubscriptionConversationFilterInput | null > | null,
};

export type ModelSubscriptionMessageFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  conversationId?: ModelSubscriptionIDInput | null,
  text?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionIntInput | null,
  userId?: ModelSubscriptionIntInput | null,
  fileUrl?: ModelSubscriptionStringInput | null,
  fileMimeType?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMessageFilterInput | null > | null,
  or?: Array< ModelSubscriptionMessageFilterInput | null > | null,
};

export type ModelSubscriptionS3ObjectFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  bucket?: ModelSubscriptionStringInput | null,
  region?: ModelSubscriptionStringInput | null,
  key?: ModelSubscriptionStringInput | null,
  mimeType?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionS3ObjectFilterInput | null > | null,
  or?: Array< ModelSubscriptionS3ObjectFilterInput | null > | null,
};

export type CreateUserConversationMutationVariables = {
  input: CreateUserConversationInput,
  condition?: ModelUserConversationConditionInput | null,
};

export type CreateUserConversationMutation = {
  createUserConversation?:  {
    __typename: "UserConversation",
    id: string,
    lastReadAt?: number | null,
    conversation:  {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    userId: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userConversationConversationId: string,
  } | null,
};

export type UpdateUserConversationMutationVariables = {
  input: UpdateUserConversationInput,
  condition?: ModelUserConversationConditionInput | null,
};

export type UpdateUserConversationMutation = {
  updateUserConversation?:  {
    __typename: "UserConversation",
    id: string,
    lastReadAt?: number | null,
    conversation:  {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    userId: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userConversationConversationId: string,
  } | null,
};

export type DeleteUserConversationMutationVariables = {
  input: DeleteUserConversationInput,
  condition?: ModelUserConversationConditionInput | null,
};

export type DeleteUserConversationMutation = {
  deleteUserConversation?:  {
    __typename: "UserConversation",
    id: string,
    lastReadAt?: number | null,
    conversation:  {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    userId: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userConversationConversationId: string,
  } | null,
};

export type CreateConversationMutationVariables = {
  input: CreateConversationInput,
  condition?: ModelConversationConditionInput | null,
};

export type CreateConversationMutation = {
  createConversation?:  {
    __typename: "Conversation",
    id: string,
    createdAt: number,
    userIds?: string | null,
    lastMessageCreatedAt?: number | null,
    lastMessageText?: string | null,
    lastMessageFileUrl?: string | null,
    lastMessageFileUser?: string | null,
    lastMessageFileMimeType?: string | null,
    lastMessageUserId?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      items:  Array< {
        __typename: "Message",
        id: string,
        conversationId: string,
        text?: string | null,
        createdAt: number,
        userId: number,
        fileUrl?: string | null,
        fileMimeType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        messageFileId?: string | null,
      } | null >,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    lastMessageFileType?: string | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateConversationMutationVariables = {
  input: UpdateConversationInput,
  condition?: ModelConversationConditionInput | null,
};

export type UpdateConversationMutation = {
  updateConversation?:  {
    __typename: "Conversation",
    id: string,
    createdAt: number,
    userIds?: string | null,
    lastMessageCreatedAt?: number | null,
    lastMessageText?: string | null,
    lastMessageFileUrl?: string | null,
    lastMessageFileUser?: string | null,
    lastMessageFileMimeType?: string | null,
    lastMessageUserId?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      items:  Array< {
        __typename: "Message",
        id: string,
        conversationId: string,
        text?: string | null,
        createdAt: number,
        userId: number,
        fileUrl?: string | null,
        fileMimeType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        messageFileId?: string | null,
      } | null >,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    lastMessageFileType?: string | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteConversationMutationVariables = {
  input: DeleteConversationInput,
  condition?: ModelConversationConditionInput | null,
};

export type DeleteConversationMutation = {
  deleteConversation?:  {
    __typename: "Conversation",
    id: string,
    createdAt: number,
    userIds?: string | null,
    lastMessageCreatedAt?: number | null,
    lastMessageText?: string | null,
    lastMessageFileUrl?: string | null,
    lastMessageFileUser?: string | null,
    lastMessageFileMimeType?: string | null,
    lastMessageUserId?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      items:  Array< {
        __typename: "Message",
        id: string,
        conversationId: string,
        text?: string | null,
        createdAt: number,
        userId: number,
        fileUrl?: string | null,
        fileMimeType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        messageFileId?: string | null,
      } | null >,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    lastMessageFileType?: string | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type CreateMessageMutationVariables = {
  input: CreateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type CreateMessageMutation = {
  createMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    text?: string | null,
    createdAt: number,
    userId: number,
    fileUrl?: string | null,
    fileMimeType?: string | null,
    file?:  {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    messageFileId?: string | null,
  } | null,
};

export type UpdateMessageMutationVariables = {
  input: UpdateMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type UpdateMessageMutation = {
  updateMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    text?: string | null,
    createdAt: number,
    userId: number,
    fileUrl?: string | null,
    fileMimeType?: string | null,
    file?:  {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    messageFileId?: string | null,
  } | null,
};

export type DeleteMessageMutationVariables = {
  input: DeleteMessageInput,
  condition?: ModelMessageConditionInput | null,
};

export type DeleteMessageMutation = {
  deleteMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    text?: string | null,
    createdAt: number,
    userId: number,
    fileUrl?: string | null,
    fileMimeType?: string | null,
    file?:  {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    messageFileId?: string | null,
  } | null,
};

export type CreateS3ObjectMutationVariables = {
  input: CreateS3ObjectInput,
  condition?: ModelS3ObjectConditionInput | null,
};

export type CreateS3ObjectMutation = {
  createS3Object?:  {
    __typename: "S3Object",
    id: string,
    bucket: string,
    region: string,
    key: string,
    mimeType: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateS3ObjectMutationVariables = {
  input: UpdateS3ObjectInput,
  condition?: ModelS3ObjectConditionInput | null,
};

export type UpdateS3ObjectMutation = {
  updateS3Object?:  {
    __typename: "S3Object",
    id: string,
    bucket: string,
    region: string,
    key: string,
    mimeType: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteS3ObjectMutationVariables = {
  input: DeleteS3ObjectInput,
  condition?: ModelS3ObjectConditionInput | null,
};

export type DeleteS3ObjectMutation = {
  deleteS3Object?:  {
    __typename: "S3Object",
    id: string,
    bucket: string,
    region: string,
    key: string,
    mimeType: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type GetUserConversationQueryVariables = {
  id: string,
};

export type GetUserConversationQuery = {
  getUserConversation?:  {
    __typename: "UserConversation",
    id: string,
    lastReadAt?: number | null,
    conversation:  {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    userId: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userConversationConversationId: string,
  } | null,
};

export type ListUserConversationsQueryVariables = {
  filter?: ModelUserConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserConversationsQuery = {
  listUserConversations?:  {
    __typename: "ModelUserConversationConnection",
    items:  Array< {
      __typename: "UserConversation",
      id: string,
      lastReadAt?: number | null,
      conversation:  {
        __typename: "Conversation",
        id: string,
        createdAt: number,
        userIds?: string | null,
        lastMessageCreatedAt?: number | null,
        lastMessageText?: string | null,
        lastMessageFileUrl?: string | null,
        lastMessageFileUser?: string | null,
        lastMessageFileMimeType?: string | null,
        lastMessageUserId?: string | null,
        lastMessageFileType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
      },
      userId: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userConversationConversationId: string,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncUserConversationsQueryVariables = {
  filter?: ModelUserConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncUserConversationsQuery = {
  syncUserConversations?:  {
    __typename: "ModelUserConversationConnection",
    items:  Array< {
      __typename: "UserConversation",
      id: string,
      lastReadAt?: number | null,
      conversation:  {
        __typename: "Conversation",
        id: string,
        createdAt: number,
        userIds?: string | null,
        lastMessageCreatedAt?: number | null,
        lastMessageText?: string | null,
        lastMessageFileUrl?: string | null,
        lastMessageFileUser?: string | null,
        lastMessageFileMimeType?: string | null,
        lastMessageUserId?: string | null,
        lastMessageFileType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
      },
      userId: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userConversationConversationId: string,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetConversationQueryVariables = {
  id: string,
};

export type GetConversationQuery = {
  getConversation?:  {
    __typename: "Conversation",
    id: string,
    createdAt: number,
    userIds?: string | null,
    lastMessageCreatedAt?: number | null,
    lastMessageText?: string | null,
    lastMessageFileUrl?: string | null,
    lastMessageFileUser?: string | null,
    lastMessageFileMimeType?: string | null,
    lastMessageUserId?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      items:  Array< {
        __typename: "Message",
        id: string,
        conversationId: string,
        text?: string | null,
        createdAt: number,
        userId: number,
        fileUrl?: string | null,
        fileMimeType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        messageFileId?: string | null,
      } | null >,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    lastMessageFileType?: string | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListConversationsQueryVariables = {
  filter?: ModelConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListConversationsQuery = {
  listConversations?:  {
    __typename: "ModelConversationConnection",
    items:  Array< {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncConversationsQueryVariables = {
  filter?: ModelConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncConversationsQuery = {
  syncConversations?:  {
    __typename: "ModelConversationConnection",
    items:  Array< {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetMessageQueryVariables = {
  id: string,
};

export type GetMessageQuery = {
  getMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    text?: string | null,
    createdAt: number,
    userId: number,
    fileUrl?: string | null,
    fileMimeType?: string | null,
    file?:  {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    messageFileId?: string | null,
  } | null,
};

export type ListMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMessagesQuery = {
  listMessages?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      conversationId: string,
      text?: string | null,
      createdAt: number,
      userId: number,
      fileUrl?: string | null,
      fileMimeType?: string | null,
      file?:  {
        __typename: "S3Object",
        id: string,
        bucket: string,
        region: string,
        key: string,
        mimeType: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
      } | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      messageFileId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncMessagesQueryVariables = {
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncMessagesQuery = {
  syncMessages?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      conversationId: string,
      text?: string | null,
      createdAt: number,
      userId: number,
      fileUrl?: string | null,
      fileMimeType?: string | null,
      file?:  {
        __typename: "S3Object",
        id: string,
        bucket: string,
        region: string,
        key: string,
        mimeType: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
      } | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      messageFileId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type GetS3ObjectQueryVariables = {
  id: string,
};

export type GetS3ObjectQuery = {
  getS3Object?:  {
    __typename: "S3Object",
    id: string,
    bucket: string,
    region: string,
    key: string,
    mimeType: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListS3ObjectsQueryVariables = {
  filter?: ModelS3ObjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListS3ObjectsQuery = {
  listS3Objects?:  {
    __typename: "ModelS3ObjectConnection",
    items:  Array< {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncS3ObjectsQueryVariables = {
  filter?: ModelS3ObjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncS3ObjectsQuery = {
  syncS3Objects?:  {
    __typename: "ModelS3ObjectConnection",
    items:  Array< {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type UserConversationByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserConversationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserConversationByUserIdQuery = {
  userConversationByUserId?:  {
    __typename: "ModelUserConversationConnection",
    items:  Array< {
      __typename: "UserConversation",
      id: string,
      lastReadAt?: number | null,
      conversation:  {
        __typename: "Conversation",
        id: string,
        createdAt: number,
        userIds?: string | null,
        lastMessageCreatedAt?: number | null,
        lastMessageText?: string | null,
        lastMessageFileUrl?: string | null,
        lastMessageFileUser?: string | null,
        lastMessageFileMimeType?: string | null,
        lastMessageUserId?: string | null,
        lastMessageFileType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
      },
      userId: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      userConversationConversationId: string,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type ByConversationQueryVariables = {
  conversationId: string,
  id?: ModelIDKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ByConversationQuery = {
  byConversation?:  {
    __typename: "ModelMessageConnection",
    items:  Array< {
      __typename: "Message",
      id: string,
      conversationId: string,
      text?: string | null,
      createdAt: number,
      userId: number,
      fileUrl?: string | null,
      fileMimeType?: string | null,
      file?:  {
        __typename: "S3Object",
        id: string,
        bucket: string,
        region: string,
        key: string,
        mimeType: string,
        type: string,
        createdAt: string,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
      } | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
      messageFileId?: string | null,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateUserConversationSubscriptionVariables = {
  filter?: ModelSubscriptionUserConversationFilterInput | null,
};

export type OnCreateUserConversationSubscription = {
  onCreateUserConversation?:  {
    __typename: "UserConversation",
    id: string,
    lastReadAt?: number | null,
    conversation:  {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    userId: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userConversationConversationId: string,
  } | null,
};

export type OnUpdateUserConversationSubscriptionVariables = {
  filter?: ModelSubscriptionUserConversationFilterInput | null,
};

export type OnUpdateUserConversationSubscription = {
  onUpdateUserConversation?:  {
    __typename: "UserConversation",
    id: string,
    lastReadAt?: number | null,
    conversation:  {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    userId: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userConversationConversationId: string,
  } | null,
};

export type OnDeleteUserConversationSubscriptionVariables = {
  filter?: ModelSubscriptionUserConversationFilterInput | null,
};

export type OnDeleteUserConversationSubscription = {
  onDeleteUserConversation?:  {
    __typename: "UserConversation",
    id: string,
    lastReadAt?: number | null,
    conversation:  {
      __typename: "Conversation",
      id: string,
      createdAt: number,
      userIds?: string | null,
      lastMessageCreatedAt?: number | null,
      lastMessageText?: string | null,
      lastMessageFileUrl?: string | null,
      lastMessageFileUser?: string | null,
      lastMessageFileMimeType?: string | null,
      lastMessageUserId?: string | null,
      messages?:  {
        __typename: "ModelMessageConnection",
        nextToken?: string | null,
        startedAt?: number | null,
      } | null,
      lastMessageFileType?: string | null,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    },
    userId: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    userConversationConversationId: string,
  } | null,
};

export type OnCreateConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null,
};

export type OnCreateConversationSubscription = {
  onCreateConversation?:  {
    __typename: "Conversation",
    id: string,
    createdAt: number,
    userIds?: string | null,
    lastMessageCreatedAt?: number | null,
    lastMessageText?: string | null,
    lastMessageFileUrl?: string | null,
    lastMessageFileUser?: string | null,
    lastMessageFileMimeType?: string | null,
    lastMessageUserId?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      items:  Array< {
        __typename: "Message",
        id: string,
        conversationId: string,
        text?: string | null,
        createdAt: number,
        userId: number,
        fileUrl?: string | null,
        fileMimeType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        messageFileId?: string | null,
      } | null >,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    lastMessageFileType?: string | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null,
};

export type OnUpdateConversationSubscription = {
  onUpdateConversation?:  {
    __typename: "Conversation",
    id: string,
    createdAt: number,
    userIds?: string | null,
    lastMessageCreatedAt?: number | null,
    lastMessageText?: string | null,
    lastMessageFileUrl?: string | null,
    lastMessageFileUser?: string | null,
    lastMessageFileMimeType?: string | null,
    lastMessageUserId?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      items:  Array< {
        __typename: "Message",
        id: string,
        conversationId: string,
        text?: string | null,
        createdAt: number,
        userId: number,
        fileUrl?: string | null,
        fileMimeType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        messageFileId?: string | null,
      } | null >,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    lastMessageFileType?: string | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteConversationSubscriptionVariables = {
  filter?: ModelSubscriptionConversationFilterInput | null,
};

export type OnDeleteConversationSubscription = {
  onDeleteConversation?:  {
    __typename: "Conversation",
    id: string,
    createdAt: number,
    userIds?: string | null,
    lastMessageCreatedAt?: number | null,
    lastMessageText?: string | null,
    lastMessageFileUrl?: string | null,
    lastMessageFileUser?: string | null,
    lastMessageFileMimeType?: string | null,
    lastMessageUserId?: string | null,
    messages?:  {
      __typename: "ModelMessageConnection",
      items:  Array< {
        __typename: "Message",
        id: string,
        conversationId: string,
        text?: string | null,
        createdAt: number,
        userId: number,
        fileUrl?: string | null,
        fileMimeType?: string | null,
        updatedAt: string,
        _version: number,
        _deleted?: boolean | null,
        _lastChangedAt: number,
        messageFileId?: string | null,
      } | null >,
      nextToken?: string | null,
      startedAt?: number | null,
    } | null,
    lastMessageFileType?: string | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnCreateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnCreateMessageSubscription = {
  onCreateMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    text?: string | null,
    createdAt: number,
    userId: number,
    fileUrl?: string | null,
    fileMimeType?: string | null,
    file?:  {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    messageFileId?: string | null,
  } | null,
};

export type OnUpdateMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnUpdateMessageSubscription = {
  onUpdateMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    text?: string | null,
    createdAt: number,
    userId: number,
    fileUrl?: string | null,
    fileMimeType?: string | null,
    file?:  {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    messageFileId?: string | null,
  } | null,
};

export type OnDeleteMessageSubscriptionVariables = {
  filter?: ModelSubscriptionMessageFilterInput | null,
};

export type OnDeleteMessageSubscription = {
  onDeleteMessage?:  {
    __typename: "Message",
    id: string,
    conversationId: string,
    text?: string | null,
    createdAt: number,
    userId: number,
    fileUrl?: string | null,
    fileMimeType?: string | null,
    file?:  {
      __typename: "S3Object",
      id: string,
      bucket: string,
      region: string,
      key: string,
      mimeType: string,
      type: string,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
    messageFileId?: string | null,
  } | null,
};

export type OnCreateS3ObjectSubscriptionVariables = {
  filter?: ModelSubscriptionS3ObjectFilterInput | null,
};

export type OnCreateS3ObjectSubscription = {
  onCreateS3Object?:  {
    __typename: "S3Object",
    id: string,
    bucket: string,
    region: string,
    key: string,
    mimeType: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateS3ObjectSubscriptionVariables = {
  filter?: ModelSubscriptionS3ObjectFilterInput | null,
};

export type OnUpdateS3ObjectSubscription = {
  onUpdateS3Object?:  {
    __typename: "S3Object",
    id: string,
    bucket: string,
    region: string,
    key: string,
    mimeType: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteS3ObjectSubscriptionVariables = {
  filter?: ModelSubscriptionS3ObjectFilterInput | null,
};

export type OnDeleteS3ObjectSubscription = {
  onDeleteS3Object?:  {
    __typename: "S3Object",
    id: string,
    bucket: string,
    region: string,
    key: string,
    mimeType: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};
