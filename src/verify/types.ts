export enum IntegrationId {
  ClickUp = 'clickup',
  GitLab = 'gitlab',
  Hive = 'hive',
  Jira = 'jira',
  Meister = 'meister',
  Quire = 'quire',
  Shortcut = 'shortcut',
  Teamwork = 'teamwork',
  Todoist = 'todoist',
  Wrike = 'wrike',
}

export const entityNameToMethod = {
  users: 'getUsers',
  projects: 'getProjects',
  tasks: 'getTasks',
} as const;

export type MainEntityName = 'users' | 'projects' | 'tasks';

export type EntityName = MainEntityName | string;

export type DependenciesMap = Partial<Record<EntityName, EntityName[]>>;
