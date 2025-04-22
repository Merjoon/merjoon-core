export interface IQuireConfig {
  token: string;
  refreshToken: string;
  clientId: string;
  clientSecret: string;
  limit: number;
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
  remote_id: string;
  remote_created_at: string;
  remote_modified_at: string;
  name: string;
  description: string;
  nextText: string;
}

export interface IQuireUser {
  id: string;
  created_at: string;
  modified_at: string;
  remote_id: string;
  remote_created_at: string;
  remote_modified_at: string;
  name: string;
  email_address: string;
  nextText: string;
}

export interface IQuireTask {
  id: string;
  created_at: string;
  modified_at: string;
  remote_id: string;
  name: string;
  assignees: string;
  status: string;
  description: string;
  projects: string[];
  remote_created_at: string;
  remote_modified_at: string;
  ticket_url: string;
  nextText: string;
}
