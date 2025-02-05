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
}

export enum TeamworkApiPath {
  People = 'people',
  Projects = 'projects',
  Tasks = 'tasks',
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
  id: string;
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
  assignees: ITeamworkTaskAssignee[];
  projectId?: string;

}
export interface ITeamworkItem {
  id: string;
}
export interface ITeamworkTaskAssignee {
  'id'?: string;
}
