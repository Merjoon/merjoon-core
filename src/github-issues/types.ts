export interface IGithubIssuesConfig {
  token: string;
}
export interface IGithubIssuesOrg {
  id: string;
}
export interface IGithubIssuesRepo {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
export interface IGithubIssuesMember {
  id: number;
  login: string;
}

export enum GithubIssuesApiPath {
  User = 'user',
  Orgs = 'orgs',
  Repos = 'repos',
  Members = 'members',
}
