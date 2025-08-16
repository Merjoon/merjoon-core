import { IMerjoonService } from '../common/types';

export enum IntegrationId {
  ClickUp = 'clickup',
  Freedcamp = 'freedcamp',
  GitLab = 'gitlab',
  Hive = 'hive',
  Jira = 'jira',
  Meister = 'meister',
  Plane = 'plane',
  Quire = 'quire',
  Shortcut = 'shortcut',
  Teamwork = 'teamwork',
  Todoist = 'todoist',
  Wrike = 'wrike',
}

export type MerjoonEntityName = 'users' | 'projects' | 'tasks';
export type EntityName = MerjoonEntityName | string;
export type EntityMethodName = keyof Pick<IMerjoonService, 'getProjects' | 'getUsers' | 'getTasks'>;

export const ENTITY_NAME_TO_METHOD: Record<EntityName, EntityMethodName> = {
  users: 'getUsers',
  projects: 'getProjects',
  tasks: 'getTasks',
} as const;

export type EntityDependencyMap = Record<EntityName, EntityName[]>;

export interface ServiceWithDependencies {
  service: IMerjoonService;
  dependencies: EntityDependencyMap;
}
