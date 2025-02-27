import { GitLabApiPath } from './types';

export const GITLAB_PATH = {
  ISSUES: GitLabApiPath.Issues,
  PROJECTS: GitLabApiPath.Projects,
  GROUPS: GitLabApiPath.Groups,
  MEMBERS: (id: string): string => {
    return `${GitLabApiPath.Groups}/${id}/${GitLabApiPath.Members}`;
  },
};
