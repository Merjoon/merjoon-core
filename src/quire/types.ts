export interface IQuireConfig {
  token: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}

export interface IQuireQueryParams {
  page?: number;
  pageSize?: number;
  include?: string;
}

export enum QuireApiPath {
  User = 'user',
  Project = 'project',
  Task = 'task',
}

export interface IQuireProject {
  id: string;
  oid: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
  nextText: string;
}

export interface IQuireUser {
  id: string;
  created_at: string;
  modified_at: string;
  name: string;
  email_address: string;
  nextText: string;
}

export interface IQuireTask {
  id: string;
  created_at: string;
  modified_at: string;
  name: string;
  assignees: string;
  status: string;
  description: string;
  projects: string[];
  ticket_url: string;
  nextText: string;
}

export interface IRefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
