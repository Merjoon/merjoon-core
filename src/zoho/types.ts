export interface IZohoConfig {
  refreshToken: string;
  clientId: string;
  clientSecret: string;
}

export interface IZohoPostOauthBody {
  grant_type: string;
  refresh_token: string;
  client_id: string;
  client_secret: string;
}

export interface IRefreshTokenResponse {
  access_token: string;
}

export enum ZohoApiPath {
  Portals = 'portals',
  Portal = 'portal',
  Users = 'users',
}

export interface IZohoPortals {
  portals: IZohoPortalId[];
}

export interface IZohoPortalId {
  id: number;
}

export interface IZohoUser {
  id: number;
  name: string;
  emailAddress: string;
}

export interface IZohoUsers {
  users: IZohoUser[];
}
