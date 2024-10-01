import { IntegrationId } from './types';
import { teamworkService } from './services/teamwork';
import { IMerjoonService } from '../common/types';

const servicesMap = {
  [IntegrationId.Teamwork]: teamworkService
}

export function getService(id: IntegrationId): IMerjoonService {
  return servicesMap[id]
}
