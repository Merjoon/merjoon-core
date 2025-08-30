export interface IGithubIssuesConfig {
  token: string;
  maxSockets: number;
  limit: number;
  maxSockets: number;
}
export interface IGithubIssueQueryParams {
  per_page?: number;
}
export interface IGithubIssuesOrg {
  login: string;
}
export interface IGithubIssuesRepo {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  owner: IGithubIssuesOrg;
}
export interface IGithubIssuesMember {
  id: number;
  login: string;
}
export interface IGithubIssuesRepoIssue {
  id: number;
  title: string;
  assignees: IGithubIssuesMember[];
  created_at: string;
  updated_at: string;
  state: string;
  body: string;
  url: string;
}
export interface IGithubIssuesLinks {
  next?: string;
  prev?: string;
  last?: string;
  first?: string;
}

export enum GithubIssuesApiPath {
  User = 'user',
  Orgs = 'orgs',
  Repos = 'repos',
  Members = 'members',
  Issues = 'issues',
}
