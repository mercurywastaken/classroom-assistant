import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";





type EagerResources = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Resources, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly file?: string | null;
  readonly classid: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyResources = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Resources, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly description?: string | null;
  readonly file?: string | null;
  readonly classid: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Resources = LazyLoading extends LazyLoadingDisabled ? EagerResources : LazyResources

export declare const Resources: (new (init: ModelInit<Resources>) => Resources) & {
  copyOf(source: Resources, mutator: (draft: MutableModel<Resources>) => MutableModel<Resources> | void): Resources;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly role: string;
  readonly Participant?: (Classes | null)[] | null;
  readonly data?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly role: string;
  readonly Participant: AsyncCollection<Classes>;
  readonly data?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerClasses = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Classes, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userid: string;
  readonly data: string;
  readonly Resources?: (Resources | null)[] | null;
  readonly participants: (string | null)[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyClasses = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Classes, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userid: string;
  readonly data: string;
  readonly Resources: AsyncCollection<Resources>;
  readonly participants: (string | null)[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Classes = LazyLoading extends LazyLoadingDisabled ? EagerClasses : LazyClasses

export declare const Classes: (new (init: ModelInit<Classes>) => Classes) & {
  copyOf(source: Classes, mutator: (draft: MutableModel<Classes>) => MutableModel<Classes> | void): Classes;
}