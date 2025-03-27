export interface IPlaneConfig {
  apiKey: string;
  workspaceSlug: string;
  maxSockets: number;
  limit: number;
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
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  assignees: any[];
  project: string;
  created_at: string;
  updated_at: string;
  state: {
    id: string;
    name: string;
  };
}
