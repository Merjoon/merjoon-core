import { ZohoApiPath } from './types';

export const ZOHO_PATHS = {
  PORTALS: `${ZohoApiPath.Portals}/`,
  USERS: (portalId: number) => `${ZohoApiPath.Portal}/${portalId}/${ZohoApiPath.Users}/`,
};
