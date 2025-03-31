export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
  maxSockets: number;
  limit: number;
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
}
export interface ITeamworkItem {
  id: number;
}
export interface ITeamworkResponseType<T> {
  projects: T[];
  people: T[];
  tasks: T[];
  meta: {
    page: {
      hasMore: boolean;
    };
  };
}
