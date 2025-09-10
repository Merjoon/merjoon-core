import { getGitLabService } from '../../gitlab/gitlab-service';
import { IDependencies } from '../types';

export const dependencies: IDependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getGitLabService();
