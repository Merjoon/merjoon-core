export interface IHiveConfig {
  apiKey: string;
}

export enum HiveApiPath {
  Users = 'users',
  Projects = 'projects',
  Actions = 'actions',
  Workspaces = 'workspaces',
}

export interface IHiveQueryParams {
  first: number;
  after?: string;
}

export interface IHiveUser {
  'id': string;
  'fullName': string;
  'email': string;
}

export interface IHiveProject {
  'id': string;
  'name': string;
  'description': string;
  'createdAt': string;
  'modifiedAt': string;
}

export interface IHiveAction {
  'id': string;
  'title': string;
  'assignees': string[] | null;
  'status': string;
  'description': string;
  'projectId': string;
  'createdAt': string;
  'modifiedAt': string;
}

export interface IHiveItem {
  'id': string;
}

export interface IHiveV2Response {
  edges: IHiveEdge[];
  pageInfo: IHiveV2PageInfo;
}

export interface IHiveEdge {
  cursor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  node: any;
}

export interface IHiveV2PageInfo {
  endCursor: string;
  hasNextPage: boolean;
}
