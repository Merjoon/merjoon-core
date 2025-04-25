export interface IGithubConfig {
  apiKey: string;
  subDomain: string;
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
