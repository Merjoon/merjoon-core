import { IntegrationId } from './types';
import { teamworkService } from './services/teamwork';
import { hiveService } from './services/hive'; // Assuming this is a promise
import { IMerjoonService } from '../common/types';
import { jiraService } from './services/jira';

const servicesMap = {
  [IntegrationId.Hive]: hiveService,
  [IntegrationId.Jira]: jiraService,
  [IntegrationId.Teamwork]: teamworkService,
};

export function getService(id: IntegrationId): IMerjoonService {
  return servicesMap[id];
}
