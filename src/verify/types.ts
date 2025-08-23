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

export type EntityName = 'users' | 'projects' | 'tasks';

export const ENTITY_NAME_TO_METHOD = {
  users: 'getUsers',
  projects: 'getProjects',
  tasks: 'getTasks',
} as const;

export type IKahnsAlgorithmGeneric<T extends string> = Record<T, T[]>;
