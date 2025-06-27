export enum QuireApiPath {
  User = 'user',
  Project = 'project',
  Task = 'task',
  List = 'list',
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

export interface IQuireConfig {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}
export interface IQuirePostOauthBody {
  grant_type: string;
  refresh_token: string;
  client_id: string;
  client_secret: string;
}
