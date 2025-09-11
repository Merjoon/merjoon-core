import { IntegrationResult } from '../types';

export function printResults(results: PromiseSettledResult<IntegrationResult>[]) {
  results.forEach((r) => {
    if (r.status === 'fulfilled') {
      console.log(`✅ ${r.value.id}`); // eslint-disable-line no-console
    } else if (r.status === 'rejected') {
      console.log(`❌ ${r.reason.id}-${r.reason.error}`); // eslint-disable-line no-console
    }
  });
}
