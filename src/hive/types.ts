export type IHiveConfig = {
  api_key: string;
  user_id: string;
  workspaceId: string;
}

export type IHiveQueryParams = {
  page: number;
  pageSize: number;
}

export enum HiveApiPath {
  People = 'users',
  Projects = 'projects',
  Tasks = 'actions',
}

export const RESULT_KEY ={
  [HiveApiPath.People]: 'people',
  [HiveApiPath.Projects]: 'projects',
  [HiveApiPath.Tasks]: 'todo-items',
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

