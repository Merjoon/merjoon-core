import { PlaneApiPath } from './types';

export const PLANE_PATH = {
  PROJECTS: PlaneApiPath.Projects,
  ISSUES: (projectId: string) => `${PlaneApiPath.Projects}/${projectId}/${PlaneApiPath.Issues}`,
};
