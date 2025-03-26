import { IBaseQueryParams, ResponseDataType } from '../common/types';

export interface IGitLabConfig {
  token: string;
  maxSockets: number;
  limit: number;
}

export interface IGitLabQueryParams extends IBaseQueryParams {
  page?: number;
  per_page?: number;
  owned?: boolean;
}
export enum GitLabApiPath {
  Issues = 'issues',
  Projects = 'projects',
  Groups = 'groups',
  Members = 'members',
}
export interface IGitLabIssue extends ResponseDataType {
  id: string;
  name: string;
  assignees: string[];
  labels: string;
  description: string;
  projects: string[];
  created_at?: number;
  updated_at?: number;
  web_url: string;
}
export interface IGitLabGroup extends ResponseDataType {
  id: string;
}
export interface IGitLabMember extends ResponseDataType {
  id: number;
  name: string;
}
export interface IGitLabProject extends ResponseDataType {
  id: string;
  created_at: string;
  last_activity_at: string;
  name: string;
  description: string;
}
// export interface IGitLabBaseEntity {
//   id: number | string;
// }
