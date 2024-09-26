import { IntegrationId } from './types';
import { teamworkService } from './services/teamwork';
import { hiveService } from './services/hive';
import { IMerjoonService } from '../common/types';

const servicesMap = {
  [IntegrationId.Teamwork]: teamworkService,
  [IntegrationId.Hive]: hiveService
}

export function getService(id: IntegrationId): IMerjoonService {
  return servicesMap[id]
}
