import { getJiraService } from '../../jira/jira-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getJiraService();
