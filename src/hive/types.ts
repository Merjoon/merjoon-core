export interface IHiveConfig {
  api_key: string;
  user_id: string;
  workspace_id: string;
}

export enum HiveApiPath {
  People = 'users',
  Projects = 'projects',
  Tasks = 'actions',
}

export interface IHivePeople {
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

export interface IHiveTask {
  'id': string;
  'title': string;
  'assignees': string[];
  'status': string;
  'description': string;
  'projectId': string;
  'createdAt': string;
  'modifiedAt': string;
}
