import * as dotenv from 'dotenv';
dotenv.config();
import { IntegrationId } from './types';
import { verifyIntegration } from './utils';

async function main() {
  const integrationId = process.argv[2] as IntegrationId;
  if (integrationId) {
    await verifyIntegration(integrationId);
  } else {
    const integrations = Object.values(IntegrationId);
    for (const integrationId of integrations) {
      await verifyIntegration(integrationId);
    }
  }
}
main();
