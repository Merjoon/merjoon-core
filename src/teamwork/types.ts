import https from 'https';

export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
  httpsAgent?: https.Agent;
}

export interface ITeamworkQueryParams {
  page: number;
  pageSize: number;
}

export enum  TeamworkApiPath {
  People = 'people',
  Projects = 'projects',
  Tasks = 'tasks',
}

export interface ITeamworkPeople {
  'id': number;
  'firstName': string;
  'lastName': string;
  'full-name': string;
  'email-address': string;
  'created-at': string;
  'last-changed-on': string;
}

export interface ITeamworkProject {
  'id': string;
  'name': string;
  'description': string;
  'created-on': string;
  'last-changed-on': string;
}

export interface ITeamworkTask {
  'id': number;
  'boardColumn': ITeamworkTaskBoardColumn;
  'content': string;
  'responsible-party-ids'?: string;
  'description': string;
  'created-on': string;
  'last-changed-on': string;
  'assignees': ITeamworkTaskAssignee[];
  'projects'?: ITeamworkTaskProjects[];

}
export interface ITeamworkTaskBoardColumn {
  'id': number;
  'name': string;
  'color': string;
}
export interface ITeamworkItem {
  id: string;
}
export interface ITeamworkTaskAssignee {
  'id'?: string;
}
export interface ITeamworkTaskProjects{
  'id'?:string;
}

export interface ITeamworkResponse<T> {
  projects: T[];
  meta: {
    page: {
      pageOffset: number;
      pageSize: number;
      count: number;
      hasMore: boolean;
    };
  };
}

export interface ITeamworkItem {
  id: string;
}