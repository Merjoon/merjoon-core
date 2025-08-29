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
        console.log(`✅ ${id} verified`); // eslint-disable-line no-console
        return {
          id,
          success: true,
        };
      } catch (err) {
        console.error(`❌ ${id} failed`, err); // eslint-disable-line no-console
        return {
          id,
          success: false,
        };
      }
    }),
  );

  const successes = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
  const failures = results.length - successes;

  console.log('\n--- Stats ---'); // eslint-disable-line no-console
  console.log(`✅ Successes: ${successes}`); // eslint-disable-line no-console
  console.log(`❌ Failures: ${failures}`); // eslint-disable-line no-console

  if (failures > 0) {
    process.exit(1);
  }
}

main();
