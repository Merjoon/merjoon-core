export interface IHeightConfig {
  apiKey: string;
  limit: string;
}

export interface IHeightQueryParams {
  limit: number;
  usePagination: boolean;
  filters: string;
}

export enum HeightApiPath {
  Users = 'users',
  Lists = 'lists',
  Tasks = 'tasks',
}

export interface IHeightUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  signedUpAt?: string;
}

export interface IHeightList {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IHeightTask {
  id: string;
  name: string;
  assigneesIds: string[];
  status: string;
  description: string;
  listIds: string[];
  createdAt: string;
  lastActivityAt: string;
  url: string;
}