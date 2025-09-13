import { getGithubIssuesService } from '../../github-issues/github-issues-service';
import { ISequenceDependencies } from '../types';

export const dependencies: ISequenceDependencies = {
  projects: [],
  users: [],
  tasks: ['projects'],
};

export const service = getGithubIssuesService();
