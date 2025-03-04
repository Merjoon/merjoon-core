export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
  httpsAgent?:ITeamworkConfigHttpsAgent ;
}

export interface ITeamworkConfigHttpsAgent  {
  maxSockets?: number;
}

export interface ITeamworkQueryParams {
  page: number;
  pageSize: number;
  include?: string;
}

export enum TeamworkApiPath {
  People = 'people',
  Projects = 'projects',
  Tasks = 'tasks',
  Include = 'include',
}

export interface ITeamworkPeople {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamworkProject {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamworkTask {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  assigneeUsers: ITeamworkItem[];
  projectId?: number;
  columnName?: string;
  included?: ITeamworIncluded[];
}
export interface ITeamworkItem {
  id: number;
}
export interface ITeamworIncluded {
  column?:{
    id: number;
  }
  columns?:{
    id: number;
    name: string;
  }
}
