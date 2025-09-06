import * as dotenv from 'dotenv';
dotenv.config();
import { IntegrationId } from './types';
import { printResults, verifyIntegration } from './utils';

async function main(): Promise<void> {
  const integrationId = process.argv[2] as IntegrationId;
  const integrations = integrationId ? [integrationId] : Object.values(IntegrationId);
  const results = await Promise.allSettled(integrations.map((id) => verifyIntegration(id)));
  printResults(results);
}
main();
