import fs from 'node:fs/promises';
import { EntityName, IntegrationId, EntityDependencyMap, ENTITY_NAME_TO_METHOD } from './types';
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

export const initGraph = (dependencies: EntityDependencyMap) => {
  const graph: Record<EntityName, EntityName[]> = {};
  const inLevel: Record<EntityName, number> = {};

  for (const node in dependencies) {
    graph[node] = [];
    inLevel[node] = 0;
  }

  return {
    graph,
    inLevel,
  };
};

export const buildGraph = (
  dependencies: EntityDependencyMap,
  graph: Record<EntityName, EntityName[]>,
  inLevel: Record<EntityName, number>,
) => {
  for (const node in dependencies) {
    for (const dep of dependencies[node] ?? []) {
      graph[dep].push(node);
      inLevel[node]++;
    }
  }
};

export const topologicalSort = (
  dependencies: EntityDependencyMap,
  graph: Record<EntityName, EntityName[]>,
  inLevel: Record<EntityName, number>,
): EntityName[][] => {
  let queue = Object.keys(inLevel).filter((n) => inLevel[n] === 0) as EntityName[];
  const stages: EntityName[][] = [];

  while (queue.length) {
    stages.push(queue);
    const nextQueue: EntityName[] = [];

    for (const node of queue) {
      for (const neighbor of graph[node]) {
        inLevel[neighbor]--;
        if (inLevel[neighbor] === 0) {
          nextQueue.push(neighbor);
        }
      }
    }

    queue = nextQueue;
  }

  if (stages.flat().length !== Object.keys(dependencies).length) {
    throw new Error('Cycle detected in dependencies');
  }

  return stages;
};

export const getExecutionOrder = (dependencies: EntityDependencyMap): EntityName[][] => {
  const { graph, inLevel } = initGraph(dependencies);
  buildGraph(dependencies, graph, inLevel);
  return topologicalSort(dependencies, graph, inLevel);
};

async function* executeOrder(service: IMerjoonService, dependencies: EntityDependencyMap) {
  const order = getExecutionOrder(dependencies);

  for (const batch of order) {
    const results = await Promise.all(
      batch.map((entity: EntityName) => {
        const method = ENTITY_NAME_TO_METHOD[entity];
        return service[method]();
      }),
    );

    yield batch.map((entity, i) => ({
      entity,
      data: results[i],
    }));
  }
}

export async function fetchEntitiesInOrder(
  service: IMerjoonService,
  integrationId: IntegrationId,
  dependencies: EntityDependencyMap,
) {
  for await (const batch of executeOrder(service, dependencies)) {
    for (const { entity, data } of batch) {
      await saveEntities(integrationId, entity, data);
    }
  }
}
