import * as dotenv from 'dotenv';
dotenv.config();

import { getService } from './service-factory';
import { IntegrationId } from './types';
import { MerjoonExecutor } from './utils';

async function main(): Promise<void> {
  const integrationId = process.argv[2] as IntegrationId;
  const { service, dependencies } = await getService(integrationId);
  await service.init();
  const executor = new MerjoonExecutor(service, integrationId);
  await executor.fetchEntitiesInOrder(dependencies);
}

main();
