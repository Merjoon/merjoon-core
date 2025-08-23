import { IntegrationId } from './types';

export async function getService(id: IntegrationId) {
  return await import(`./services/${id}`);
}
