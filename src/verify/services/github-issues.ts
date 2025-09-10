import { getGithubIssuesService } from '../../github-issues/github-issues-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getGithubIssuesService();
