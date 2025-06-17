export interface ITodoistConfig {
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
  data: T[];
}
