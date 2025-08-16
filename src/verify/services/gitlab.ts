import { getGitLabService } from '../../gitlab/gitlab-service';

export const dependencies = {
  projects: [],
  users: [],
  tasks: [],
};

export const service = getGitLabService();
