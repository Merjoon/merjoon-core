export interface IPlaneConfig {
  token: string;
  httpsAgent?: IPlaneConfigHttpsAgent;
}

export interface IPlaneConfigHttpsAgent {
  maxSockets?: number;
}

export enum PlaneApiPath {
  Projects = 'projects',
}

export interface IPlaneProject {
  id: string;
  name: string;
  description: string;
  identifier: string;
  workspace: string;
  created_at: string;
  updated_at: string;
}
