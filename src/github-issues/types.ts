export interface IGithubIssuesConfig {
  token: string;
  org: string;
  limit: number;
}
export interface IGithubIssuesRepo {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
}
export enum GithubIssuesApiPath {
  Repos = 'repos',
}
export interface IGithubIssuesQueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
}
