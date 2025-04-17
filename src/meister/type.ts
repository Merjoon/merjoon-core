export interface IMeisterConfig {
  token: string;
  limit: number;
}
export interface IMeisterQueryParams {
  page?: number;
  items?: number;
}
export enum MeisterPath {
  Tasks = 'tasks',
  Projects = 'projects',
  Persons = 'persons',
}

export interface IMeisterPersons {
  id: number;
  created_at: string;
  updated_at: string;
  firstname: string;
  lastname: string;
  email: string;
}
export interface IMeisterTasks {
  id: number;
  created_at: string;
  modified_at: string;
  name: string;
  section_name: string;
  description: string;
  projects: string;
  assignee_name: string;
  assigned_to_id: number;
}
export interface IMeisterProjects {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
