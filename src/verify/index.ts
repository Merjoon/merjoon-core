import * as dotenv from 'dotenv';
dotenv.config();
import { IntegrationId } from './types';
import { verifyIntegration } from './utils';

async function main() {
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

  const successes = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
  const failures = results.length - successes;
  for (const r of results) {
    if (r.status === 'fulfilled') {
      console.log(r.value.success ? `✅ ${r.value.id}` : `❌ ${r.value.id}`); // eslint-disable-line no-console
    }
  }

  if (failures > 0) {
    process.exit(1);
  }
}

main();
