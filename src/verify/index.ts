import * as dotenv from 'dotenv';
dotenv.config();

import { getService } from './service-factory';
import { DependenciesMap, EntityName, IntegrationId } from './types';
import { saveEntities } from './utils';
import {
  IMerjoonEntity,
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';

async function fetchEntitiesInOrder(
  service: IMerjoonService,
  dependencies: DependenciesMap,
): Promise<void> {
  const executionOrder: EntityName[] = [];
  const setEntities = new Set<EntityName>(Object.keys(dependencies) as EntityName[]);
  while (setEntities.size > 0) {
    const arr = Array.from(setEntities);
    const readyEntities = arr.filter((entity) =>
      dependencies[entity].every((d) => executionOrder.includes(d)),
    );
    if (readyEntities.length === 0) {
      throw new Error('Circular dependency detected');
    }

    executionOrder.push(...readyEntities);
    readyEntities.forEach((entity) => setEntities.delete(entity));
  }

  for (const entity of executionOrder) {
    const uppercasedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    const methodName = `get${uppercasedEntity}` as keyof IMerjoonService;
    const method = service[methodName];

    if (typeof method !== 'function') {
      continue;
    }

    let entities: IMerjoonEntity[];
    switch (methodName) {
      case 'getProjects':
        entities = await (service.getProjects() as Promise<IMerjoonProjects>);
        break;
      case 'getUsers':
        entities = await (service.getUsers() as Promise<IMerjoonUsers>);
        break;
      case 'getTasks':
        entities = await (service.getTasks() as Promise<IMerjoonTasks>);
        break;
      default:
        throw new Error(`Unknown method: ${String(methodName)}`);
    }
    if (service.integrationId) {
      await saveEntities(service.integrationId, entity, entities);
    }
  }
}

async function main(): Promise<void> {
  const integrationId = process.argv[2] as IntegrationId;
  const service = await getService(integrationId);
  await service.init();
  const path = `./services/${integrationId}`;
  const { config }: { config: { dependencies: DependenciesMap } } = await import(path);
  await fetchEntitiesInOrder(service, config.dependencies);
}

main().catch((err) => {
  throw new Error(err);
});
