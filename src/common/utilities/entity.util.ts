import { ApiAction, HandleEntityMutationOptions } from 'src/common';
import _ from 'lodash';
import { HandleEntityMutationArgs } from '../interfaces/entity.interface';

export function handleEntityMutation<Entity extends object>(
  args: HandleEntityMutationArgs<Entity>,
  options?: HandleEntityMutationOptions,
): Entity {
  const { entityName, action, payload, txn } = args;
  const entityId = _.get(payload, 'id') as any;
  const mutationData = _.omit(payload, ['id', 'action']) as any;

  switch (action) {
    case ApiAction.Create:
      return txn.create(entityName, mutationData, {
        persist: true,
      });
    case ApiAction.Update:
      const updatedEntity = txn.getReference(entityName, entityId);
      txn.assign(updatedEntity, mutationData, {
        ignoreUndefined: true,
        onlyProperties: true,
        updateNestedEntities: false,
      });
      return updatedEntity;
    case ApiAction.Delete:
      const deletedEntity = txn.getReference(entityName, entityId);
      if (options?.hardDelete) {
        txn.remove(deletedEntity);
      } else {
        txn.assign(deletedEntity, { deletedAt: new Date() } as any);
      }
      return deletedEntity;
    case ApiAction.Read:
    default:
    // No operation for Read action
  }

  return null;
}
