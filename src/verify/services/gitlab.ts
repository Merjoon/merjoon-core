import { getGitLabService } from '../../gitlab/gitlab-service';

export const config = {
  dependencies: {
    projects: [],
    users: [],
    tasks: [],
  },
};

export const service = getGitLabService();
