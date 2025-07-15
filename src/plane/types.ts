export interface IPlaneConfig {
  apiKey: string;
  workspaceSlug: string;
  limit: number;
}

export interface IPlaneQueryParams {
  per_page?: number;
  cursor?: string;
  expand?: string;
}

export enum PlaneApiPath {
  Projects = 'projects',
  Issues = 'issues',
  Members = 'members',
}

export interface IPlaneProject {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
export interface IPlaneResponse<T> {
  results: T[];
  next_cursor: string;
  next_page_results: boolean;
}

export interface IPlaneIssue {
  id: string;
  name: string;
  description_stripped: string;
  assignees: string[] | IPlaneUser[];
  project: string;
  created_at: string;
  updated_at: string;
  state: string | IPlaneState;
}

export interface IPlaneState {
  id: string;
  name: string;
}

export interface IPlaneUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  display_name: string;
}

export interface IPlaneModel {
  id: string;
}
