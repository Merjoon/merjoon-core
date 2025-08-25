import fs from 'node:fs/promises';
import { EntityName, IntegrationId } from './types';
import { IMerjoonEntity } from '../common/types';
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

export async function verifyIntegration(integrationId: IntegrationId) {
  const service = await getService(integrationId);
  await service.init();
  const users = await service.getUsers();
  const projects = await service.getProjects();
  const tasks = await service.getTasks();
  await saveEntities(integrationId, 'users', users);
  await saveEntities(integrationId, 'projects', projects);
  await saveEntities(integrationId, 'tasks', tasks);
}
