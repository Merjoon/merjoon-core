import * as dotenv from 'dotenv';
dotenv.config();
import { getService } from './service-factory';
import { IntegrationId } from './types';
import { saveEntities } from './utils';

async function main() {
  const integrationId = process.argv[2] as IntegrationId;
  const service = getService(integrationId);
  const users = await service.getUsers();
  const projects = await service.getProjects();
  const tasks = await service.getTasks();
  await saveEntities(integrationId, 'users', users);
  await saveEntities(integrationId, 'projects', projects);
  await saveEntities(integrationId, 'tasks', tasks);
}

main();
