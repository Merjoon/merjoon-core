export interface IGithubIssuesConfig {
  apiKey: string;
  organization: string;
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
  Repo = 'repos',
}
export interface IGithubIssuesQueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
}
