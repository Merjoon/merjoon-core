import { IMerjoonTransformConfigBase } from '../common/types';

export interface IHive1Config {
  apiKey: string;
}

export interface IHive2Config {
  apiKey: string;
  maxSockets: number;
  limit: number;
}

export enum HiveApiPath {
  Users = 'users',
  Projects = 'projects',
  Actions = 'actions',
  Workspaces = 'workspaces',
}

export interface IHiveQueryParams {
  first: number;
  after?: string;
  sortBy?: string;
}

export interface IHiveUser {
  id: string;
  fullName: string;
  email: string;
}

export interface IHiveProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  modifiedAt: string;
}

export interface IHiveAction {
  id: string;
  title: string;
  assignees: string[] | null;
  status: string;
  description: string;
  projectId: string;
  createdAt: string;
  modifiedAt: string;
}

export interface IHiveItem {
  id: string;
}

export interface IHiveV2Response<T> {
  edges: IHiveEdge<T>[];
  pageInfo: IHiveV2PageInfo;
}

export interface IHiveEdge<T> {
  cursor: string;
  node: T;
}

export interface IHiveV2PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}

export type IHiveTransformConfig = IMerjoonTransformConfigBase;
