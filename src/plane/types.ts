export interface IPlaneConfig {
  apiKey: string;
  workspaceSlug: string;
  limit: number;
}

export interface IPlaneQueryParams {
  per_page?: number;
  cursor?: string;
  expand?: string;
  nextPage?:boolean;
}

export enum PlaneApiPath {
  Projects = 'projects',
  Issues = 'issues',
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
  next_page_results:boolean;
}

export interface IPlaneIssue {
  id: string;
  name: string;
  description_stripped: string;
  assignees: string[];
  project: string;
  created_at: string;
  updated_at: string;
  state: IPlaneState;
}

export interface IPlaneState {
  id: string;
  name: string;
}




