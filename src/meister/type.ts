import { IMerjoonTransformConfigBase } from '../common/types';

export interface IMeisterConfig {
  token: string;
  limit: number;
  maxSockets: number;
}
export interface IMeisterQueryParams {
  page?: number;
  items?: number;
  sort?: string;
}
export enum MeisterPath {
  Tasks = 'tasks',
  Projects = 'projects',
  Persons = 'persons',
}

export interface IMeisterPerson {
  id: number;
  created_at: string;
  updated_at: string;
  firstname: string;
  lastname: string;
  email: string;
}
export interface IMeisterTask {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  section_name: string;
  description: string;
  projects: string;
  assignee_name: string;
  assigned_to_id: number;
}
export interface IMeisterProject {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  notes: string;
}

export type IMeisterTransformConfig = IMerjoonTransformConfigBase;
