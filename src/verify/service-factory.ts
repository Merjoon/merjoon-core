import { IntegrationId } from './types';
import { teamworkService } from './services/teamwork';
import { IMerjoonService } from '../common/types';
import { jiraService } from './services/jira';

const servicesMap = {
  [IntegrationId.Jira]: jiraService,
  [IntegrationId.Teamwork]: teamworkService,
};

export function getService(id: IntegrationId): IMerjoonService {
  return servicesMap[id];
}
