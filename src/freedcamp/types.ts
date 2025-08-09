export interface IFreedcampConfig {
  apiKey: string;
  apiSecret: string;
  limit: number;
}

export interface IFreedcampQueryParams {
  limit?: number;
  offset?: number;
}

export enum FreedcampPath {
  Projects = 'projects',
  Users = 'users',
  Tasks = 'tasks',
}

export interface IFreedcampProjectsData {
  projects: IFreedcampProject[];
}

export interface IFreedcampProject {
  id: string;
  project_name: string;
  project_description: string;
  created_ts: number;
}

export interface IFreedcampUsersData {
  users: IFreedcampUser[];
}

export interface IFreedcampUser {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface IFreedcampTasksResponseData {
  tasks: IFreedcampTask[];
  meta: IFreedcampResponseDataMeta;
}

export interface IFreedcampResponseDataMeta {
  has_more: boolean;
}

export interface IFreedcampTask {
  id: string;
  title: string;
  status_title: string;
  assigned_ids: string[];
  project_id: string;
  description: string;
  created_ts: number;
  updated_ts: number;
  url: string;
}

export interface IFreedcampResponse<T> {
  data: T;
}
