import { IMerjoonTransformConfigBase } from '../common/types';

export interface IGitLabConfig {
  token: string;
  maxSockets: number;
  limit: number;
}

export interface IGitLabQueryParams {
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
export interface IGitLabIssue {
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
export interface IGitLabGroup {
  id: string;
}
export interface IGitLabMember {
  id: number;
  name: string;
}
export interface IGitLabProject {
  id: string;
  created_at: string;
  last_activity_at: string;
  name: string;
  description: string;
}

export type IGitLabTransformConfig = IMerjoonTransformConfigBase;
