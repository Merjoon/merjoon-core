import { getGithubIssuesService } from '../../github-issues/github-issues-service';
import { BaseEntityName, INodeAdjacency } from '../types';

export const dependencies: INodeAdjacency<BaseEntityName> = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getGithubIssuesService();
