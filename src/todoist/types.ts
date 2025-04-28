export interface ITodoistConfig {
  token: string;
}

export enum TodoistApiPath {
  Projects = 'projects',
}

export interface ITodoistResponse {
  data: {
    id: string;
    name: string;
  };
}
