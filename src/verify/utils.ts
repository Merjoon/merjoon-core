// utils.ts
import fs from 'node:fs/promises';
import { ENTITY_NAME_TO_METHOD, EntityName, IKahnsAlgorithmGeneric, IntegrationId } from './types';
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

export function createIndegrees<T extends string>(dependencies: Record<T, T[]>) {
  const indegrees: Record<T, number> = {} as Record<T, number>;
  for (const node in dependencies) {
    const deps = dependencies[node as T] ?? [];
    indegrees[node as T] = deps.length;
  }
  return indegrees;
}

export function createDependents<T extends string>(dependencies: Record<T, T[]>) {
  const dependents: IKahnsAlgorithmGeneric<T> = {} as IKahnsAlgorithmGeneric<T>;
  for (const node in dependencies) {
    dependents[node as T] = [];
  }
  for (const node in dependencies) {
    const deps = dependencies[node as T] ?? [];
    for (const dep of deps) {
      dependents[dep].push(node as T);
    }
  }
  return dependents;
}

export function createSequences<T extends string>(
  dependencies: IKahnsAlgorithmGeneric<T>,
  dependents: IKahnsAlgorithmGeneric<T>,
  indegrees: Record<T, number>,
) {
  let queue = (Object.keys(indegrees) as T[]).filter((n) => indegrees[n] === 0);
  const sequences: T[][] = [];

  while (queue.length) {
    sequences.push(queue);
    const nextQueue: T[] = [];
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

export function getExecutionSequence<T extends string>(dependencies: Record<T, T[]>): T[][] {
  const indegrees = createIndegrees(dependencies);
  const dependents = createDependents(dependencies);
  return createSequences(dependencies, dependents, indegrees);
}

// Generic iterator
async function* executeSequenceIterator<T extends keyof typeof ENTITY_NAME_TO_METHOD>(
  service: IMerjoonService,
  dependencies: Record<T, T[]>,
) {
  const batchResults = getExecutionSequence(dependencies);
  for (const batch of batchResults) {
    const results = await Promise.all(
      batch.map((entity) => {
        const methodName = ENTITY_NAME_TO_METHOD[entity];
        return service[methodName]();
      }),
    );
    yield batch.map((entity, i) => ({
      entity,
      data: results[i],
    }));
  }
}

export async function fetchEntitiesInSequence<T extends keyof typeof ENTITY_NAME_TO_METHOD>(
  service: IMerjoonService,
  integrationId: IntegrationId,
  dependencies: IKahnsAlgorithmGeneric<T>,
) {
  for await (const batchResult of executeSequenceIterator(service, dependencies)) {
    await Promise.all(
      batchResult.map(({ entity, data }) => saveEntities(integrationId, entity, data)),
    );
  }
}
