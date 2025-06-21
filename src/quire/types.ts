export interface IQuireConfig {
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
  editedAt: string;
  name: string;
  descriptionText: string;
}

export interface IQuireUser {
  id: string;
  name: string;
  email: string;
}

export interface IQuireTask {
  id: string;
  createdAt: string;
  editedAt: string;
  name: string;
  assignees: string;
  status: string;
  descriptionText: string;
  projects: string[];
  url: string;
}

export interface IRefreshTokenResponse {
  access_token: string;
}
