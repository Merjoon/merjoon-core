import * as dotenv from 'dotenv';
dotenv.config();
import { IntegrationId } from './types';
import { printResults, verifyIntegration } from './utils';

async function main(): Promise<void> {
  const integrationId = process.argv[2] as IntegrationId;
  const integrations = integrationId ? [integrationId] : Object.values(IntegrationId);

  const results = await Promise.allSettled(
    integrations.map(async (id) => {
      try {
        await verifyIntegration(id);
        return {
          id,
          success: true,
        };
      } catch {
        return {
          id,
          success: false,
        };
      }
    }),
  );

  printResults(results);
}

main();
