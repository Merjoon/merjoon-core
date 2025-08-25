import * as dotenv from 'dotenv';
dotenv.config();
import { IntegrationId } from './types';
import { verifyIntegration } from './utils';

async function main() {
  const integrationId = process.argv[2] as IntegrationId;
  const integrations = integrationId ? [integrationId] : Object.values(IntegrationId);

  await Promise.allSettled(
    integrations.map(async (id) => {
      try {
        await verifyIntegration(id);
        console.log(`✅ ${id} verified`); // eslint-disable-line no-console
      } catch (err) {
        console.error(`❌ ${id} failed`, err); // eslint-disable-line no-console
      }
    }),
  );
}

main();
