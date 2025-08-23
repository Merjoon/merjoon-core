import fs from 'node:fs/promises';
import { IntegrationId, EntityDependencyMap, ENTITY_NAME_TO_METHOD } from './types';
import { IMerjoonEntity, IMerjoonService } from '../common/types';

export async function saveEntities(
  serviceName: IntegrationId,
  entityName: string,
  payload: IMerjoonEntity[],
) {
  const folder = `.transformed/${serviceName}`;
  await fs.mkdir(folder, {
    recursive: true,
  });
  await fs.writeFile(`${folder}/${entityName}.json`, JSON.stringify(payload, null, 2));
}

export function createGraph(dependencies: EntityDependencyMap) {
  const graph: Record<string, string[]> = {};
  const indegree: Record<string, number> = {};

  for (const node in dependencies) {
    graph[node] = [];
    indegree[node] = 0;
  }
  for (const node in dependencies) {
    const deps = dependencies[node] ?? [];
    indegree[node] = deps.length;
    for (const dep of deps) {
      graph[dep].push(node);
    }
  }

  return {
    graph,
    indegree,
  };
}

export function sortTopologically(
  dependencies: EntityDependencyMap,
  graph: Record<string, string[]>,
  indegree: Record<string, number>,
): string[][] {
  let queue = Object.keys(indegree).filter((n) => indegree[n] === 0);
  const stages: string[][] = [];

  while (queue.length) {
    stages.push(queue);
    const nextQueue: string[] = [];

    for (const node of queue) {
      for (const neighbor of graph[node]) {
        indegree[neighbor]--;
        if (indegree[neighbor] === 0) {
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
}

export function getExecutionSequence(dependencies: EntityDependencyMap): string[][] {
  const { graph, indegree } = createGraph(dependencies);
  return sortTopologically(dependencies, graph, indegree);
}

async function* executeSequenceIterator(
  service: IMerjoonService,
  dependencies: EntityDependencyMap,
) {
  for (const batch of getExecutionSequence(dependencies)) {
    const results = await Promise.all(
      batch.map((entity) => service.call(ENTITY_NAME_TO_METHOD[entity])),
    );
    yield batch.map((entity, i) => ({
      entity,
      data: results[i],
    }));
  }
}

export async function fetchEntitiesInSequence(
  service: IMerjoonService,
  integrationId: IntegrationId,
  dependencies: EntityDependencyMap,
) {
  for await (const batch of executeSequenceIterator(service, dependencies)) {
    await Promise.all(batch.map(({ entity, data }) => saveEntities(integrationId, entity, data)));
  }
}
