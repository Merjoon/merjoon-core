import fs from 'node:fs/promises';
import {
  EntityName,
  INodeAdjacency,
  INodeIndegrees,
  IntegrationId,
  VerifyPromiseResults,
} from './types';
import { ENTITY_NAME_TO_METHOD } from './consts';
import { IMerjoonEntity, IMerjoonService } from '../common/types';
import { getService } from './service-factory';

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
  const indegrees: INodeIndegrees<T> = Object.create(null);
  for (const node in dependencies) {
    const deps = dependencies[node] ?? [];
    indegrees[node] = deps.length;
  }
  return indegrees;
}

export function createDependents<T extends string>(dependencies: Record<T, T[]>) {
  const dependents: INodeAdjacency<T> = Object.create(null);
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

export function createSequences<T extends string>(
  dependencies: INodeAdjacency<T>,
  dependents: INodeAdjacency<T>,
  indegrees: INodeIndegrees<T>,
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
  const flattenedSequences = sequences.flat();
  const dependencyKeys = Object.keys(dependencies);
  if (flattenedSequences.length !== dependencyKeys.length) {
    throw new Error('Cycle detected in dependencies');
  }

  return sequences;
}

export function getExecutionSequence<T extends string>(dependencies: Record<T, T[]>) {
  const indegrees = createIndegrees(dependencies);
  const dependents = createDependents(dependencies);
  return createSequences(dependencies, dependents, indegrees);
}

async function* executeSequenceIterator(
  service: IMerjoonService,
  dependencies: Record<EntityName, EntityName[]>,
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

export async function fetchEntitiesInSequence(
  service: IMerjoonService,
  integrationId: IntegrationId,
  dependencies: INodeAdjacency<EntityName>,
) {
  const batchResultsIterator = executeSequenceIterator(service, dependencies);
  for await (const batchResult of batchResultsIterator) {
    await Promise.all(
      batchResult.map(({ entity, data }) => saveEntities(integrationId, entity, data)),
    );
  }
}

export async function verifyIntegration(integrationId: IntegrationId) {
  const { service, dependencies } = await getService(integrationId);
  await service.init();
  await fetchEntitiesInSequence(service, integrationId, dependencies);
}

export function printResults(results: VerifyPromiseResults) {
  const successes = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
  const failures = results.length - successes;
  for (const r of results) {
    if (r.status === 'fulfilled') {
      console.log(r.value.success ? `✅ ${r.value.id}` : `❌ ${r.value.id}`); // eslint-disable-line no-console
    }
  }

  if (failures > 0) {
    process.exit(1);
  }
}
