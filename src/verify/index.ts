import * as dotenv from 'dotenv';
dotenv.config();

import { getService } from './service-factory';
import { IntegrationId } from './types';
import { fetchEntitiesInSequence } from './utils';

async function main(): Promise<void> {
  const integrationId = process.argv[2] as IntegrationId;
  const { service, dependencies } = await getService(integrationId);
  await service.init();
  await fetchEntitiesInSequence(service, integrationId, dependencies);
}

main();
