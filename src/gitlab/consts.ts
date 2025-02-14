import { GitlabApiPath } from './types';

export const GITLAB_PATH = {
  ISSUES: GitlabApiPath.Issues,
  PROJECTS: GitlabApiPath.Projects,
  GROUPS: GitlabApiPath.Groups,
  MEMBERS: (id: string): string => {
    return `${GitlabApiPath.Groups}/${id}/${GitlabApiPath.GroupMembers}`;
  }
};
