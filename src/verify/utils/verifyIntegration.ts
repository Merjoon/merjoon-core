import { IntegrationId } from '../types';
import { getService } from '../service-factory';
import { fetchEntitiesInSequence } from './executionSequence';

export async function verifyIntegration(integrationId: IntegrationId) {
  try {
    const { service, dependencies } = await getService(integrationId);
    await service.init();
    await fetchEntitiesInSequence(service, integrationId, dependencies);
    return {
      id: integrationId,
      error: undefined,
    };
  } catch (err) {
    throw {
      id: integrationId,
      error: err,
    };
  }
}
