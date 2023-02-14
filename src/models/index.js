// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UserConversation, Conversation, Message, S3Object } = initSchema(schema);

export {
  UserConversation,
  Conversation,
  Message,
  S3Object
};