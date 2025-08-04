import * as dotenv from 'dotenv';
dotenv.config();

import { getService } from './service-factory';
import { IntegrationId } from './types';
import { fetchEntitiesInOrder } from './utils';

async function main(): Promise<void> {
  const integrationId = process.argv[2] as IntegrationId;
  const service = await getService(integrationId);
  await service.init();
  const path = `./services/${integrationId}`;
  const { config } = await import(path);
  await fetchEntitiesInOrder(service, integrationId, config.dependencies);
}

main().catch((err) => {
  throw new Error(err);
});
