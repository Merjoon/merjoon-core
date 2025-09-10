import { getJiraService } from '../../jira/jira-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getJiraService();
