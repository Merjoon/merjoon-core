export interface IGithubIssuesConfig {
  token: string;
}
export interface IGithubIssuesOrg {
  id: number;
  name: string;
}
export interface IGithubIssuesRepo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  owner_id: number;
}
export interface IGithubIssuesMember {
  id: number;
  login: string;
  site_admin: boolean;
}
