export interface ITodoistConfig {
  limit: number;
  token: string;
}

export interface ITodoistProject {
  id: string;
  name: string;
  description: string | null;
}

export enum TodoistApiPath {
  Projects = 'projects',
}

export interface ITodoistResponse<T> {
  results: T[];
  next_cursor?: string;
}

export interface ITodoistQueryParams {
  limit: number;
  fields?: string;
  cursor?: string;
}
