/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUserConversation = /* GraphQL */ `
  subscription OnCreateUserConversation(
    $filter: ModelSubscriptionUserConversationFilterInput
  ) {
    onCreateUserConversation(filter: $filter) {
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
export const onUpdateUserConversation = /* GraphQL */ `
  subscription OnUpdateUserConversation(
    $filter: ModelSubscriptionUserConversationFilterInput
  ) {
    onUpdateUserConversation(filter: $filter) {
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
export const onDeleteUserConversation = /* GraphQL */ `
  subscription OnDeleteUserConversation(
    $filter: ModelSubscriptionUserConversationFilterInput
  ) {
    onDeleteUserConversation(filter: $filter) {
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
export const onCreateConversation = /* GraphQL */ `
  subscription OnCreateConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onCreateConversation(filter: $filter) {
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
export const onUpdateConversation = /* GraphQL */ `
  subscription OnUpdateConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onUpdateConversation(filter: $filter) {
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
export const onDeleteConversation = /* GraphQL */ `
  subscription OnDeleteConversation(
    $filter: ModelSubscriptionConversationFilterInput
  ) {
    onDeleteConversation(filter: $filter) {
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
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
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
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onUpdateMessage(filter: $filter) {
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
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage($filter: ModelSubscriptionMessageFilterInput) {
    onDeleteMessage(filter: $filter) {
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
export const onCreateS3Object = /* GraphQL */ `
  subscription OnCreateS3Object($filter: ModelSubscriptionS3ObjectFilterInput) {
    onCreateS3Object(filter: $filter) {
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
export const onUpdateS3Object = /* GraphQL */ `
  subscription OnUpdateS3Object($filter: ModelSubscriptionS3ObjectFilterInput) {
    onUpdateS3Object(filter: $filter) {
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
export const onDeleteS3Object = /* GraphQL */ `
  subscription OnDeleteS3Object($filter: ModelSubscriptionS3ObjectFilterInput) {
    onDeleteS3Object(filter: $filter) {
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
