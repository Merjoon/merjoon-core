import { IntegrationId } from './types';
import { clickUpService } from './services/clickup';
import { jiraService } from './services/jira';
import { teamworkService } from './services/teamwork';
import { IMerjoonService } from '../common/types';

const servicesMap = {
  [IntegrationId.ClickUp]: clickUpService,
  [IntegrationId.Jira]: jiraService,
  [IntegrationId.Teamwork]: teamworkService,
};

export function getService(id: IntegrationId): IMerjoonService {
  return servicesMap[id];
}
