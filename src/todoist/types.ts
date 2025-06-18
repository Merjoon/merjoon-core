export interface ITodoistConfig {
  limit: number;
  token: string;
}

export interface ITodoistProject {
  id: string;
  name: string;
  description: string | null;
}

export interface ITodoistUser {
  id: string;
  name: string;
  email: string;
}

export interface ITodoistQueryParams {
  limit: number;
  fields?: string;
  cursor?: string;
}

export interface ITodoistResponse<T> {
  results: T[];
  next_cursor?: string;
}

export enum TodoistApiPath {
  Projects = 'projects',
  Users = 'users',
}
