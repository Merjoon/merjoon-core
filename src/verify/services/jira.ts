import { getJiraService } from '../../jira/jira-service';
import { BaseEntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<BaseEntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getJiraService();
