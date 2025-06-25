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
  description: string;
  project_id: string;
  assigned_by_uid: string | null;
  section_id: string | null;
  added_at: string | null;
  updated_at: string | null;
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
