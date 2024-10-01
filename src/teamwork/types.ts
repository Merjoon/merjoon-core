export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
}

export interface ITeamworkQueryParams {
  page: number;
  pageSize: number;
}

export enum TeamworkApiPath {
  People = 'people.json',
  Projects = 'projects.json',
  Tasks = 'tasks.json',
}

export const RESULT_KEY ={
  [TeamworkApiPath.People]: 'people',
  [TeamworkApiPath.Projects]: 'projects',
  [TeamworkApiPath.Tasks]: 'todo-items',
}

export interface ITeamworkPeople {
  'id': number;
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
  'project-id': number;
  'created-on': string;
  'last-changed-on': string;
  'assignees': TeamworkTaskAssignee[];
}

export interface ITeamworkTaskBoardColumn {
  'id': number;
  'name': string;
  'color': string;
}

export interface ITeamworkTaskAssignee {
  'id': string;
}

// eslint-disable-next-line  @typescript-eslint/no-empty-object-type
export type TeamworkTaskAssignee = ITeamworkTaskAssignee | {};