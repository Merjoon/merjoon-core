import { IntegrationId } from './types';
import { IMerjoonBaseService } from '../common/types';

export async function getService<T extends IMerjoonBaseService = IMerjoonBaseService>(
  id: IntegrationId,
): Promise<T> {
  const { service } = await import(`./services/${id}`);
  return service;
}
