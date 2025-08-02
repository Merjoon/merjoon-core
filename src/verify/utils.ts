import fs from 'node:fs/promises';
import { DependenciesMap, EntityName, IntegrationId, EntityNameList } from './types';
import { IMerjoonEntity, IMerjoonService } from '../common/types';

export async function saveEntities(
  serviceName: IntegrationId,
  entityName: EntityName,
  payload: IMerjoonEntity[],
) {
  const folder = `.transformed/${serviceName}`;
  await fs.mkdir(folder, {
    recursive: true,
  });
  await fs.writeFile(`${folder}/${entityName}.json`, JSON.stringify(payload, null, 2));
}
export async function getExecutionOrder(dependencies: DependenciesMap): Promise<EntityName[][]> {
  const executionOrder: EntityName[][] = [];
  const independent: EntityName[] = [];
  const dependent: EntityName[] = [];

  for (const [entityName, deps] of Object.entries(dependencies)) {
    if (deps.length === 0) {
      independent.push(entityName as EntityName);
    } else {
      dependent.push(entityName as EntityName);
    }
  }
  if (dependent.length === 0) {
    return [independent];
  }
  if (independent.length === 0) {
    const allDeps = Object.values(dependencies).flat();
    if (allDeps.length >= 3) {
      throw new Error('Circular dependency detected');
    }
    return [dependent];
  }

  executionOrder.push(independent);
  dependent.forEach((entityName) => {
    executionOrder.push([entityName]);
  });
  return executionOrder;
}

export async function fetchEntitiesInOrder(
  service: IMerjoonService,
  dependencies: DependenciesMap,
): Promise<void> {
  const executionOrder = await getExecutionOrder(dependencies);
  for (const batch of executionOrder) {
    const promises: Promise<IMerjoonEntity[]>[] = [];
    for (const entityName of batch) {
      promises.push(service[EntityNameList[entityName]]());
    }
    const batchResults = await Promise.all(promises);

    if (service.integrationId) {
      for (let i = 0; i < batch.length; i++) {
        await saveEntities(service.integrationId, batch[i], batchResults[i]);
      }
    }
  }
}
