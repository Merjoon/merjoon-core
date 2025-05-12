export interface IFreedcampConfig {
  apiKey: string;
}

export enum FreedcampPath {
  Projects = 'projects',
  Users = 'users',
}

export interface IFreedcampResponse<T> {
  data: T;
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
