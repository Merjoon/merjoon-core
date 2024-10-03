export interface IHiveConfig {
  api_key: string;
  user_id: string;
}

export enum HiveApiPath {
  Users = 'users',
  Projects = 'projects',
  Actions = 'actions',
  Workspaces = '',
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
  'assignees': string[];
  'status': string;
  'description': string;
  'projectId': string;
  'createdAt': string;
  'modifiedAt': string;
}

export interface IHiveItem {
  'id': string;
}