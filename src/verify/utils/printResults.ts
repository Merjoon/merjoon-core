import { IntegrationCheckResults } from '../types';

export function printResults(results: IntegrationCheckResults) {
  let hasFailures = false;

  results.forEach((r) => {
    if (r.status === 'fulfilled') {
      console.log(`✅ ${r.value.id}`); // eslint-disable-line no-console
    } else if (r.status === 'rejected') {
      hasFailures = true;
      console.log(`❌ ${r.reason.id}-${r.reason.error}`); // eslint-disable-line no-console
    }
  });
  return hasFailures;
}
