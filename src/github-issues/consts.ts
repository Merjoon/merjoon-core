import { GithubIssuesApiPath } from './types';

export const GITHUB_ISSUES_PATH = {
  USER: GithubIssuesApiPath.User,
  ORGS: `${GithubIssuesApiPath.User}/${GithubIssuesApiPath.Orgs}`,
  REPOS: (id: string): string => {
    return `${GithubIssuesApiPath.Orgs}/${id}/${GithubIssuesApiPath.Repos}`;
  },
  MEMBERS: (id: string): string => {
    return `${GithubIssuesApiPath.Orgs}/${id}/${GithubIssuesApiPath.Members}`;
  },
};
