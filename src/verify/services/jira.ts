import { getJiraService } from '../../jira/jira-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getJiraService();
