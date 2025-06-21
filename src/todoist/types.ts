export interface ITodoistConfig {
  limit: number;
  token: string;
}

export interface ITodoistProject {
  id: string;
  name: string;
  description: string;
}

export interface ITodoistCollaborator {
  id: string;
  email: string;
  name: string;
}

export interface ITodoistTask {
  id: string;
  content: string;
  assigned_by_uid: string;
  description: string;
  project_id: string;
  completed_at: string;
  section_id: string;
}

export interface ITodoistSection {
  id: string;
  name: string;
}

export enum TodoistApiPath {
  Projects = 'projects',
  Collaborators = 'collaborators',
  Tasks = 'tasks',
  Sections = 'sections',
}

export interface ITodoistResponse<T> {
  results: T[];
  next_cursor?: string;
}

export interface ITodoistQueryParams {
  limit: number;
  cursor?: string;
}
