/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUserConversation = /* GraphQL */ `
  mutation CreateUserConversation(
    $input: CreateUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    createUserConversation(input: $input, condition: $condition) {
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
export const updateUserConversation = /* GraphQL */ `
  mutation UpdateUserConversation(
    $input: UpdateUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    updateUserConversation(input: $input, condition: $condition) {
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
export const deleteUserConversation = /* GraphQL */ `
  mutation DeleteUserConversation(
    $input: DeleteUserConversationInput!
    $condition: ModelUserConversationConditionInput
  ) {
    deleteUserConversation(input: $input, condition: $condition) {
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
export const createConversation = /* GraphQL */ `
  mutation CreateConversation(
    $input: CreateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    createConversation(input: $input, condition: $condition) {
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
export const updateConversation = /* GraphQL */ `
  mutation UpdateConversation(
    $input: UpdateConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    updateConversation(input: $input, condition: $condition) {
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
export const deleteConversation = /* GraphQL */ `
  mutation DeleteConversation(
    $input: DeleteConversationInput!
    $condition: ModelConversationConditionInput
  ) {
    deleteConversation(input: $input, condition: $condition) {
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
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
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
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
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
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
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
export const createS3Object = /* GraphQL */ `
  mutation CreateS3Object(
    $input: CreateS3ObjectInput!
    $condition: ModelS3ObjectConditionInput
  ) {
    createS3Object(input: $input, condition: $condition) {
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
export const updateS3Object = /* GraphQL */ `
  mutation UpdateS3Object(
    $input: UpdateS3ObjectInput!
    $condition: ModelS3ObjectConditionInput
  ) {
    updateS3Object(input: $input, condition: $condition) {
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
export const deleteS3Object = /* GraphQL */ `
  mutation DeleteS3Object(
    $input: DeleteS3ObjectInput!
    $condition: ModelS3ObjectConditionInput
  ) {
    deleteS3Object(input: $input, condition: $condition) {
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
