import { IMerjoonServiceBase, IMerjoonServiceComments } from '../common/types';

export enum IntegrationId {
  ClickUp = 'clickup',
  Freedcamp = 'freedcamp',
  GithubIssues = 'github-issues',
  GitLab = 'gitlab',
  Hive = 'hive',
  Jira = 'jira',
  Meister = 'meister',
  Plane = 'plane',
  Quire = 'quire',
  Shortcut = 'shortcut',
  Teamwork = 'teamwork',
  Todoist = 'todoist',
  Trello = 'trello',
  Wrike = 'wrike',
}

export interface ISequenceDependencies {
  users: EntityName[];
  projects: EntityName[];
  tasks: EntityName[];
  comments?: EntityName[];
}

export type EntityName = 'users' | 'projects' | 'tasks' | 'comments';
export type INodeIndegrees<T extends string> = Record<T, number>;
export type INodeAdjacency<T extends string> = Partial<Record<T, T[]>>;
export type IMerjoonService = IMerjoonServiceBase & Partial<IMerjoonServiceComments>;

export interface IntegrationResult {
  id: IntegrationId;
  error?: unknown;
}
