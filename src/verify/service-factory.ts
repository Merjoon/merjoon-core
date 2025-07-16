import { IntegrationId } from './types';
import { IMerjoonService } from '../common/types';

export async function getService(id: IntegrationId): Promise<IMerjoonService> {
  const { service } = await import(`./services/${id}`);
  service.integrationId = id;
  return service;
}
