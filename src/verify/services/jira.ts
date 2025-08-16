import { getJiraService } from '../../jira/jira-service';

export const dependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getJiraService();
