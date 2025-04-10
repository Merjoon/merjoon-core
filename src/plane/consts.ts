import { PlaneApiPath } from './types';

export const PLANE_PATH = {
  PROJECTS: PlaneApiPath.Projects,
  ISSUES_BY_PROJECT_ID: (projectId: string) =>
    `${PlaneApiPath.Projects}/${projectId}/${PlaneApiPath.Issues}`,
};
