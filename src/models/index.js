// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Resources, User, Classes } = initSchema(schema);

export {
  Resources,
  User,
  Classes
};