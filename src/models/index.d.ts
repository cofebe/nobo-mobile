import { ModelInit, MutableModel } from '@aws-amplify/datastore';
// @ts-ignore
import {
  LazyLoading,
  LazyLoadingDisabled,
  AsyncItem,
  AsyncCollection,
} from '@aws-amplify/datastore';

type UserConversationMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type ConversationMetaData = {
  readOnlyFields: 'updatedAt';
};

type MessageMetaData = {
  readOnlyFields: 'updatedAt';
};

type S3ObjectMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
};

type EagerUserConversation = {
  readonly id: string;
  readonly lastReadAt?: number | null;
  readonly conversation: Conversation;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userConversationConversationId: string;
};

type LazyUserConversation = {
  readonly id: string;
  readonly lastReadAt?: number | null;
  readonly conversation: AsyncItem<Conversation>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userConversationConversationId: string;
};

export declare type UserConversation = LazyLoading extends LazyLoadingDisabled
  ? EagerUserConversation
  : LazyUserConversation;

export declare const UserConversation: (new (
  init: ModelInit<UserConversation, UserConversationMetaData>
) => UserConversation) & {
  copyOf(
    source: UserConversation,
    mutator: (
      draft: MutableModel<UserConversation, UserConversationMetaData>
    ) => MutableModel<UserConversation, UserConversationMetaData> | void
  ): UserConversation;
};

type EagerConversation = {
  readonly id: string;
  readonly createdAt: number;
  readonly userIds?: string | null;
  readonly lastMessageCreatedAt?: number | null;
  readonly lastMessageText?: string | null;
  readonly lastMessageFileType?: string | null;
  readonly lastMessageUserId?: string | null;
  readonly messages?: (Message | null)[] | null;
  readonly updatedAt?: string | null;
};

type LazyConversation = {
  readonly id: string;
  readonly createdAt: number;
  readonly userIds?: string | null;
  readonly lastMessageCreatedAt?: number | null;
  readonly lastMessageText?: string | null;
  readonly lastMessageFileType?: string | null;
  readonly lastMessageUserId?: string | null;
  readonly messages: AsyncCollection<Message>;
  readonly updatedAt?: string | null;
};

export declare type Conversation = LazyLoading extends LazyLoadingDisabled
  ? EagerConversation
  : LazyConversation;

export declare const Conversation: (new (
  init: ModelInit<Conversation, ConversationMetaData>
) => Conversation) & {
  copyOf(
    source: Conversation,
    mutator: (
      draft: MutableModel<Conversation, ConversationMetaData>
    ) => MutableModel<Conversation, ConversationMetaData> | void
  ): Conversation;
};

type EagerMessage = {
  readonly id: string;
  readonly conversationId: string;
  readonly text?: string | null;
  readonly createdAt: number;
  readonly userId: number;
  readonly file?: S3Object | null;
  readonly updatedAt?: string | null;
  readonly messageFileId?: string | null;
};

type LazyMessage = {
  readonly id: string;
  readonly conversationId: string;
  readonly text?: string | null;
  readonly createdAt: number;
  readonly userId: number;
  readonly file: AsyncItem<S3Object | undefined>;
  readonly updatedAt?: string | null;
  readonly messageFileId?: string | null;
};

export declare type Message = LazyLoading extends LazyLoadingDisabled ? EagerMessage : LazyMessage;

export declare const Message: (new (init: ModelInit<Message, MessageMetaData>) => Message) & {
  copyOf(
    source: Message,
    mutator: (
      draft: MutableModel<Message, MessageMetaData>
    ) => MutableModel<Message, MessageMetaData> | void
  ): Message;
};

type EagerS3Object = {
  readonly id: string;
  readonly bucket: string;
  readonly region: string;
  readonly key: string;
  readonly mimeType: string;
  readonly type: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

type LazyS3Object = {
  readonly id: string;
  readonly bucket: string;
  readonly region: string;
  readonly key: string;
  readonly mimeType: string;
  readonly type: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
};

export declare type S3Object = LazyLoading extends LazyLoadingDisabled
  ? EagerS3Object
  : LazyS3Object;

export declare const S3Object: (new (init: ModelInit<S3Object, S3ObjectMetaData>) => S3Object) & {
  copyOf(
    source: S3Object,
    mutator: (
      draft: MutableModel<S3Object, S3ObjectMetaData>
    ) => MutableModel<S3Object, S3ObjectMetaData> | void
  ): S3Object;
};
