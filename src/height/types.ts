export type IHeightConfig = {
  secret: string;
};

export type IHeightQueryParams = {
  page: number;
  pageSize: number;
};

export enum HeightApiPath {
  People = 'users',
  Projects = 'lists',
  Tasks = 'tasks',
}

export interface IHeightUser {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  signedUpAt: string;
}

export interface IHeightList {
  id: string;
  name: string;
  description: string;
  'created-on': string;
  'last-changed-on': string;
}

export interface IHeightTask {
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
