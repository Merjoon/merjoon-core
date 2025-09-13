import { getJiraService } from '../../jira/jira-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getJiraService();
