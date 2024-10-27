import { IntegrationId } from './types';
import { teamworkService } from './services/teamwork';
import { IMerjoonService } from '../common/types';
import { jiraService } from './services/jira';
import { heightService } from './services/height';

const servicesMap = {
  [IntegrationId.Teamwork]: teamworkService,
  [IntegrationId.Height]: heightService,
  [IntegrationId.Jira]: jiraService,
};

export function getService(id: IntegrationId): IMerjoonService {
  return servicesMap[id];
}
