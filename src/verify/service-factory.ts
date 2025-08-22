import { IntegrationId, ServiceWithDependencies } from './types';
import { IMerjoonService } from '../common/types';

export async function getService(id: IntegrationId): Promise<ServiceWithDependencies> {
  const { service, dependencies } = await import(`./services/${id}`);
  const resolvedService: IMerjoonService = service instanceof Promise ? await service : service;

  return {
    service: resolvedService,
    dependencies,
  };
}
