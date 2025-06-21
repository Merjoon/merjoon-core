export interface ITodoistConfig {
  limit: number;
  token: string;
}

export interface ITodoistProject {
  id: string;
  name: string;
  description: string;
}

export interface ITodoistCollaborator {
  id: string;
  email: string;
  name: string;
}

export enum TodoistApiPath {
  Projects = 'projects',
  Collaborators = 'collaborators',
}

export interface ITodoistResponse<T> {
  results: T[];
  next_cursor?: string;
}

export interface ITodoistQueryParams {
  limit: number;
  cursor?: string;
}
