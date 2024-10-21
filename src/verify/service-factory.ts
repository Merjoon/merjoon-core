import { IntegrationId } from './types';
import { teamworkService } from './services/teamwork';
import { clickUpService } from './services/clickup';
import { IMerjoonService } from '../common/types';

const servicesMap = {
  [IntegrationId.Teamwork]: teamworkService,
  [IntegrationId.ClickUp]: clickUpService,
};

export function getService(id: IntegrationId): IMerjoonService {
  return servicesMap[id]
}