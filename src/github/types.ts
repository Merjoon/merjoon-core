export interface IGithubConfig {
  apiKey: string;
  subDomain: string;
  limit: number;
}
export interface IGithubRepo {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
}
export enum GithubApiPath {
  Repositories = 'repos',
}
export interface IGithubQueryParams {
  page?: number;
  per_page?: number;
  sort?: string;
}
