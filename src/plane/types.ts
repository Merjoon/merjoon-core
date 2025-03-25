export interface IPlaneConfig {
  apiKey: string;
  workspaceSlug: string;
}

export enum PlaneApiPath {
  Projects = 'projects',
}

export interface IPlaneProject {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
