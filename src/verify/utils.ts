import fs from 'node:fs/promises';
import { DependenciesMap, EntityName, IntegrationId } from './types';
import {
  IMerjoonEntity,
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';

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

export async function getExecutionOrder(dependencies: DependenciesMap): Promise<EntityName[]> {
  const dependenciesArr = Object.keys(dependencies) as EntityName[];
  const executionOrder: EntityName[] = [];
  let copyDependencies = [...dependenciesArr];

  dependenciesArr.forEach(() => {
    if (copyDependencies.length === 0) {
      return;
    }

    const readyEntities = copyDependencies.filter((entity) =>
      dependencies[entity].every((dep) => executionOrder.includes(dep)),
    );

    if (readyEntities.length === 0) {
      throw new Error('Circular dependency detected');
    }

    executionOrder.push(...readyEntities);
    copyDependencies = copyDependencies.filter((e) => !readyEntities.includes(e));
  });

  return executionOrder;
}

export async function fetchEntitiesInOrder(
  service: IMerjoonService,
  dependencies: DependenciesMap,
): Promise<void> {
  const executionOrder = await getExecutionOrder(dependencies);

  for (const entity of executionOrder) {
    const methodName =
      `get${entity.charAt(0).toUpperCase() + entity.slice(1)}` as keyof IMerjoonService;
    const method = service[methodName];

    if (typeof method !== 'function') {
      continue;
    }

    let entities: IMerjoonEntity[];
    if (methodName === 'getProjects') {
      entities = (await service.getProjects()) as IMerjoonProjects;
    } else if (methodName === 'getUsers') {
      entities = (await service.getUsers()) as IMerjoonUsers;
    } else if (methodName === 'getTasks') {
      entities = (await service.getTasks()) as IMerjoonTasks;
    } else {
      throw new Error(`Unknown method: ${methodName}`);
    }

    if (service.integrationId) {
      await saveEntities(service.integrationId, entity, entities);
    }
  }
}
