export interface IJiraConfig {
    token: string,
    password: string,
    subdomain: string,
    email: string
}

export enum JiraApiPath {
    Users = 'users/search',
    Projects = '/project/search',
    Tasks = '/search',
  }

  export interface IJiraQueryParams {
    startAt: number;
    maxResults: number;
  }