import { ZohoApiPath } from './types';

export const ZOHO_PATHS = {
  PORTALS: `${ZohoApiPath.Portals}/`,
  USERS: (projectId: number) => `${ZohoApiPath.Portal}/${projectId}/${ZohoApiPath.Users}/`,
};
