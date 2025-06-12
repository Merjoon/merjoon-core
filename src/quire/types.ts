export interface IQuireConfig {
  token: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}
export enum QuireApiPath {
  User = 'user',
  Project = 'project',
  Task = 'task',
}

export interface IQuireProject {
  id: string;
  oid: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
}

export interface IQuireUser {
  id: string;
  createdAt: string;
  modifiedAt: string;
  name: string;
  email: string;
}

export interface IQuireTask {
  id: string;
  createdAt: string;
  modifiedAt: string;
  name: string;
  assignees: string;
  status: string;
  description: string;
  projects: string[];
  ticket_url: string;
}

export interface IRefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
