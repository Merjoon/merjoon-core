export interface IHeightConfig {
  apiKey: string;
}

export interface IHeightQueryParams {
  page?: number;
  limit: number;
  usePagination?: boolean;
  order?: string;
  filters?: string;
}

export enum HeightApiPath {
  Users = "users",
  Lists = "lists",
  Tasks = "tasks",
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

export type IHeightGeneralType = IHeightUser | IHeightList | IHeightTask;
