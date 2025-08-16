import { IntegrationId, ServiceWithDependencies } from './types';

export async function getService(id: IntegrationId): Promise<ServiceWithDependencies> {
  const { service, dependencies } = await import(`./services/${id}`);
  return {
    service,
    dependencies,
  };
}
