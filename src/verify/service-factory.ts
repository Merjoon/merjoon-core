import { IntegrationId } from './types';
import { teamworkService } from './services/teamwork';
import { clickUpService } from './services/clickup';
import { IMerjoonService } from '../common/types';

const servicesMap = {
  [IntegrationId.Teamwork]: teamworkService,
  [IntegrationId.ClickUp]: clickUpService,
};

export async function getService(id: IntegrationId): Promise<IMerjoonService> {
  const service = servicesMap[id];

  if (service instanceof Promise) {
    return await service;
  }

  return service;
}