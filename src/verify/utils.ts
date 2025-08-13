import fs from 'node:fs/promises';
import { DependenciesMap, EntityName, IntegrationId, entityNameToMethod } from './types';
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

export function getExecutionOrder(dependencies: DependenciesMap) {
  const graph: Record<string, EntityName[]> = {};
  const inDegree: Record<string, number> = {};

  for (const node in dependencies) {
    const typedNode = node as EntityName;
    if (!graph[typedNode]) {
      graph[typedNode] = [];
    }
    if (!inDegree[typedNode]) {
      inDegree[typedNode] = 0;
    }
  }

  for (const node in dependencies) {
    const typedNode = node as EntityName;
    const deps = dependencies[typedNode] ?? [];
    for (const dep of deps) {
      graph[dep].push(typedNode);
      inDegree[typedNode]++;
    }
  }

  const stages: EntityName[][] = [];
  let queue: EntityName[] = [];

  for (const node in inDegree) {
    const typedNode = node as EntityName;
    if (inDegree[typedNode] === 0) {
      queue.push(typedNode);
    }
  }

  while (queue.length > 0) {
    const currentStage = [...queue];
    stages.push(currentStage);

    const nextQueue: EntityName[] = [];

    for (const node of currentStage) {
      for (const neighbor of graph[node]) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) {
          nextQueue.push(neighbor);
        }
      }
    }

    queue = nextQueue;
  }

  const totalVisited = stages.flat().length;
  if (totalVisited !== Object.keys(dependencies).length) {
    throw new Error('Cycle detected in dependencies');
  }
  return stages;
}

export async function fetchEntitiesInOrder(
  service: IMerjoonService,
  integrationId: IntegrationId,
  dependencies: DependenciesMap,
) {
  const executionOrder = getExecutionOrder(dependencies);

  for (const batch of executionOrder) {
    const invalidEntities = batch.filter((entity) => !(entity in entityNameToMethod));
    if (invalidEntities.length > 0) {
      throw new Error(`No method defined for entities: ${invalidEntities.join(', ')}`);
    }
    const mainEntities = batch.filter(
      (entity): entity is keyof typeof entityNameToMethod => entity in entityNameToMethod,
    );

    const promises = mainEntities.map((entityName) => {
      const method = entityNameToMethod[entityName];
      return service[method]();
    });

    const batchResults = await Promise.all(promises);

    await Promise.all(
      mainEntities.map((entityName, index) =>
        saveEntities(integrationId, entityName, batchResults[index]),
      ),
    );
  }
}
