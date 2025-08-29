import { getJiraService } from '../../jira/jira-service';
import { EntityName, IKahnsAlgorithmGeneric } from '../types';

export const dependencies: IKahnsAlgorithmGeneric<EntityName> = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getJiraService();
