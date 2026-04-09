import { EntityData, EntityManager, EntityName } from "@mikro-orm/core";
import { ApiAction } from "../enums";

export interface BaseEntityMutation {
  id?: string;
  action: ApiAction;
}

export interface HandleEntityMutationArgs<Entity> {
  entityName: EntityName<Entity>;
  action: ApiAction;
  payload: EntityData<Entity>;
  txn: EntityManager;
}

export interface HandleEntityMutationOptions {
  hardDelete?: boolean;
}
