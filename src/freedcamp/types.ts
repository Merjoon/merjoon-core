export interface IFreedcampConfig {
  token: string;
}

export enum FreedcampPath {
  Projects = 'projects',
}

export interface IFreedcampProjectsResponse {
  data: IFreedcampProjectsData;
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
