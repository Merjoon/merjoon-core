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

export type EntityName = 'users' | 'projects' | 'tasks';

export type DependenciesMap = Record<EntityName, EntityName[]>;

export enum EntityNameList {
  users = 'getUsers',
  projects = 'getProjects',
  tasks = 'getTasks',
}
