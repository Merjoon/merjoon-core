import { ResponseDataType } from '../common/types';

export interface IPlaneConfig {
  apiKey: string;
  workspaceSlug: string;
}

export enum PlaneApiPath {
  Projects = 'projects',
}

export interface IPlaneProject extends ResponseDataType {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
export interface IPlaneResponseType<T> extends ResponseDataType {
  results: T[];
}
