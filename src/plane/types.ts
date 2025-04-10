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
}

export interface IPlaneProject {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IPlaneIssue {
  id: string;
  name: string;
  description_html: string;
  assignees: string[];
  project: string;
  created_at: string;
  updated_at: string;
  state: {
    id: string;
    name: string;
  };
}
