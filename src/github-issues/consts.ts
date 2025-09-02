import { GithubIssuesApiPath } from './types';
import { IMerjoonBaseTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonBaseTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    remote_created_at: 'TIMESTAMP("created_at", "$$iso")',
    remote_modified_at: 'TIMESTAMP("updated_at", "$$iso")',
    name: 'name',
    description: 'description',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'login',
    remote_created_at: 'TIMESTAMP("created_at", "$$iso")',
    remote_modified_at: 'TIMESTAMP("updated_at", "$$iso")',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'title',
    '[assignees]': '[assignees]->UUID("id")',
    status: 'state',
    description: 'body',
    remote_created_at: 'TIMESTAMP("created_at", "$$iso")',
    remote_modified_at: 'TIMESTAMP("updated_at", "$$iso")',
    ticket_url: 'url',
    '[projects]': 'UUID("id")',
  },
};

export const GITHUB_ISSUES_PATH = {
  USER: GithubIssuesApiPath.User,
  USER_ORGS: `${GithubIssuesApiPath.User}/${GithubIssuesApiPath.Orgs}`,
  ORG_REPOS: (orgLogin: string): string => {
    return `${GithubIssuesApiPath.Orgs}/${orgLogin}/${GithubIssuesApiPath.Repos}`;
  },
  ORG_MEMBERS: (orgLogin: string): string => {
    return `${GithubIssuesApiPath.Orgs}/${orgLogin}/${GithubIssuesApiPath.Members}`;
  },
  REPO_ISSUES: (ownerLogin: string, repoName: string): string => {
    return `${GithubIssuesApiPath.Repos}/${ownerLogin}/${repoName}/${GithubIssuesApiPath.Issues}`;
  },
};
