import { GithubIssuesApiPath } from './types';

export const GITHUB_ISSUES_PATH = {
  USER: GithubIssuesApiPath.User,
  USER_ORGS: `${GithubIssuesApiPath.User}/${GithubIssuesApiPath.Orgs}`,
  ORG_REPOS: (id: string): string => {
    return `${GithubIssuesApiPath.Orgs}/${id}/${GithubIssuesApiPath.Repos}`;
  },
  ORG_MEMBERS: (id: string): string => {
    return `${GithubIssuesApiPath.Orgs}/${id}/${GithubIssuesApiPath.Members}`;
  },
};
