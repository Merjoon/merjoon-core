import { IntegrationResult } from '../types';

export function hasFailures(results: PromiseSettledResult<IntegrationResult>[]) {
  return results.some((r) => r.status === 'rejected');
}
