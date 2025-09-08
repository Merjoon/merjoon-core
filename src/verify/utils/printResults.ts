import { IntegrationId } from '../types';

export function printResults(
  results: PromiseSettledResult<{ id: IntegrationId; error: undefined }>[],
) {
  let hasFailures = false;

  results.forEach((r) => {
    if (r.status === 'fulfilled') {
      console.log(`✅ ${r.value.id}`); // eslint-disable-line no-console
    } else if (r.status === 'rejected') {
      hasFailures = true;
      console.log(`❌ ${r.reason.id}-${r.reason.error}`); // eslint-disable-line no-console
    }
  });

  if (hasFailures) {
    process.exit(1);
  }
}
