import { IBaseQueryParams, ResponseDataType } from '../common/types';

export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
  maxSockets: number;
  limit: number;
}
export interface ITeamworkQueryParams extends IBaseQueryParams {
  page: number;
  pageSize: number;
}

export enum TeamworkApiPath {
  People = 'people',
  Projects = 'projects',
  Tasks = 'tasks',
}

export interface ITeamworkPeople extends ResponseDataType {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamworkProject extends ResponseDataType {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamworkTask extends ResponseDataType {
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
export interface ITeamworkResponseType<T> extends ResponseDataType {
  projects: T[];
  people: T[];
  task: T[];
  meta: {
    page: {
      hasMore: boolean;
    };
  };
}
