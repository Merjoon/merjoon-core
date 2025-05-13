export interface ITodoistConfig {
  token: string;
}

export enum TodoistApiPath {
  Projects = 'projects',
}

export interface ITodoistResponse {
  data: ITodoistProject;
}
export interface ITodoistProject {
  id: string;
  name: string;
}
