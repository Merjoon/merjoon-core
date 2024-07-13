export type ITeamworkConfig = {
  token: string;
  password: string;
  subdomain: string;
};

export type ITeamworkQueryParams = {
  page: number;
  pageSize: number;
};

export enum TeamworkApiPath {
  People = 'people.json',
  Projects = 'projects.json',
  Tasks = 'tasks.json',
}

export const RESULT_KEY = {
  [TeamworkApiPath.People]: 'people',
  [TeamworkApiPath.Projects]: 'projects',
  [TeamworkApiPath.Tasks]: 'todo-items',
};

export interface ITeamworkPeople {
  id: number;
  'full-name': string;
  'email-address': string;
  'created-at': string;
  'last-changed-on': string;
}

export interface ITeamworkProject {
  id: string;
  name: string;
  description: string;
  'created-on': string;
  'last-changed-on': string;
}

export interface ITeamworkTask {
  id: number;
  content: string;
  'creator-id': number;
  boardColumn: {
    id: number;
    name: string;
    color: string;
  };
  description: string;
  'project-id': number;
  'created-on': string;
  'last-changed-on': string;
  priority: string;
}
