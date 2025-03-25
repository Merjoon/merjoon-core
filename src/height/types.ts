import { IBaseQueryParams } from '../common/types';

export interface IHeightConfig {
  apiKey: string;
  limit: number;
}

export interface IHeightQueryParams extends IBaseQueryParams {
  limit?: number;
  filters?: string;
}

export enum HeightApiPath {
  Users = 'users',
  Lists = 'lists',
  Tasks = 'tasks',
}
export interface IHeightList {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export interface IHeightUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  signedUpAt?: string;
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

export interface IHeightFilters {
  createdAt?: IHeightFilterOperator;
}

interface IHeightFilterOperator {
  lt: IHeightFilterBy;
}
interface IHeightFilterBy {
  date: string;
}
