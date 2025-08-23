import { IntegrationId, ServiceWithDependencies } from './types';

export async function getService(id: IntegrationId): Promise<ServiceWithDependencies> {
  return await import(`./services/${id}`);
}
