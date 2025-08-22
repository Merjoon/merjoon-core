import { IMerjoonMethods, IMerjoonService } from '../common/types';

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

export const ENTITY_NAME_TO_METHOD: Record<string, keyof IMerjoonMethods> = {
  users: 'getUsers',
  projects: 'getProjects',
  tasks: 'getTasks',
} as const;

export type EntityDependencyMap = Record<string, string[]>;

export interface ServiceWithDependencies {
  service: IMerjoonService;
  dependencies: EntityDependencyMap;
}
