import fs from 'node:fs/promises';
import {
  ENTITY_NAME_TO_METHOD,
  EntityDependencyMap,
  IDependents,
  IIndegrees,
  IntegrationId,
  ISequences,
} from './types';
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

export function createIndegrees(dependencies: EntityDependencyMap) {
  const indegrees: IIndegrees = {};
  for (const node in dependencies) {
    const deps = dependencies[node] ?? [];
    indegrees[node] = deps.length;
  }
  return indegrees;
}

export function createDependents(dependencies: EntityDependencyMap) {
  const dependents: IDependents = {};
  for (const node in dependencies) {
    dependents[node] = [];
  }
  for (const node in dependencies) {
    const deps = dependencies[node] ?? [];
    for (const dep of deps) {
      dependents[dep].push(node);
    }
  }
  return dependents;
}

export function createSequences(
  dependencies: EntityDependencyMap,
  dependents: IDependents,
  indegrees: IIndegrees,
) {
  let queue = Object.keys(indegrees).filter((n) => indegrees[n] === 0);
  const sequences: ISequences = [];

  while (queue.length) {
    sequences.push(queue);
    const nextQueue: string[] = [];

    for (const node of queue) {
      for (const neighbor of dependents[node]) {
        indegrees[neighbor]--;
        if (indegrees[neighbor] === 0) {
          nextQueue.push(neighbor);
        }
      }
    }

    queue = nextQueue;
  }

  if (sequences.flat().length !== Object.keys(dependencies).length) {
    throw new Error('Cycle detected in dependencies');
  }

  return sequences;
}

export function getExecutionSequence(dependencies: EntityDependencyMap): string[][] {
  const indegrees = createIndegrees(dependencies);
  const dependents = createDependents(dependencies);
  return createSequences(dependencies, dependents, indegrees);
}

async function* executeSequenceIterator(
  service: IMerjoonService,
  dependencies: EntityDependencyMap,
) {
  const batchResults = getExecutionSequence(dependencies);
  for (const batchResult of batchResults) {
    const results = await Promise.all(
      batchResult.map((entity) => {
        const methodName = ENTITY_NAME_TO_METHOD[entity];
        return service[methodName]();
      }),
    );
    yield batchResult.map((entity, i) => ({
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
  for await (const batchResult of executeSequenceIterator(service, dependencies)) {
    await Promise.all(
      batchResult.map(({ entity, data }) => saveEntities(integrationId, entity, data)),
    );
  }
}
