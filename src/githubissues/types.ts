export interface IGithubIssuesConfig {
  apiKey: string;
  subDomain: string;
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
  Repositories = 'repos',
}
export interface IGithubIssuesQueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
}
