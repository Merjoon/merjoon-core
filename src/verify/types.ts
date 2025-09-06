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

export type EntityName = 'users' | 'projects' | 'tasks';

export type INodeIndegrees<T extends string> = Record<T, number>;
export type INodeAdjacency<T extends string> = Record<T, T[]>;
