import { IntegrationId } from './types';

export async function getService(id: IntegrationId) {
  return import(`./services/${id}`);
}
