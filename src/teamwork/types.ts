export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
}

export interface ITeamworkQueryParams {
  page: number;
  pageSize: number;
}

export enum TeamworkApiPath {
  People = 'people.json',
  Projects = 'projects.json',
  Tasks = 'projects/{ProjectId}/tasks.json',
}

export const RESULT_KEY = {
  [TeamworkApiPath.People]: 'people',
  [TeamworkApiPath.Projects]: 'projects',
  [TeamworkApiPath.Tasks]:'tasks',
};

export function getResultKeyForPath(path: string): string {
  if (path.includes('tasks.json')) {
    return 'tasks';
  }

  return RESULT_KEY[path as keyof typeof RESULT_KEY] || '';
}
export interface ITeamworkPeople {
  'id': number;
  'full-name': string;
  'email-address': string;
  'created-at': string;
  'last-changed-on': string;
}

export interface ITeamworkProject {
  'id': string;
  'name': string;
  'description': string;
  'created-on': string;
  'last-changed-on': string;
}

export interface ITeamworkTask {
  'id': number;
  'boardColumn': ITeamworkTaskBoardColumn;
  'content': string;
  'responsible-party-ids'?: string;
  'description': string;
  'created-on': string;
  'last-changed-on': string;
  'assignees': ITeamworkTaskAssignee[];
  'project'?: ITeamworkTaskProjects[];
}
export interface ITeamworkTaskBoardColumn {
  'id': number;
  'name': string;
  'color': string;
}

export interface ITeamworkTaskAssignee {
  'id'?: string;
}
export interface ITeamworkTaskProjects{
  'id'?:string;
}
