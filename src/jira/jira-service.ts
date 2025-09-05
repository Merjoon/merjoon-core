import { JiraApi } from './api';
import { JiraService } from './service';
import { JiraTransformer } from './transformer';
import { IJiraConfig } from './types';

export function getJiraService(): JiraService {
  const { JIRA_TOKEN, JIRA_SUBDOMAIN, JIRA_EMAIL, JIRA_LIMIT, JIRA_MAX_SOCKETS } = process.env;

  if (!JIRA_TOKEN || !JIRA_SUBDOMAIN || !JIRA_EMAIL) {
    throw new Error('Missing necessary environment variables');
  }

  const config: IJiraConfig = {
    token: JIRA_TOKEN,
    subdomain: JIRA_SUBDOMAIN,
    email: JIRA_EMAIL,
    limit: Number(JIRA_LIMIT),
    maxSockets: Number(JIRA_MAX_SOCKETS) || 10,
  };

  const api: JiraApi = new JiraApi(config);
  const transformer: JiraTransformer = new JiraTransformer();
  return new JiraService(api, transformer);
}
