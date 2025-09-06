import { getGithubIssuesService } from '../../github-issues/github-issues-service';
import { EntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<EntityName> = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getGithubIssuesService();
