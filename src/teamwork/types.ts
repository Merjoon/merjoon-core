export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
  httpsAgent?:ITeamworkConfigHttpsAgent ;
}

export interface ITeamworkConfigHttpsAgent  {
  maxSockets?: number;
}

export interface ITeamworkQueryParams {
  page: number;
  pageSize: number;
}

export enum  TeamworkApiPath {
  People = 'people',
  Projects = 'projects',
  Tasks = 'tasks',
}

export interface ITeamworkPeople {
  'id': number;
  'firstName': string;
  'lastName': string;
  'fullName': string;
  'email': string;
  'createdAt': string;
  'lastChangedOn': string;
}

export interface ITeamworkProject {
  'id': string;
  'name': string;
  'description': string;
  'createdOn': string;
  'lastChangedOn': string;
}

export interface ITeamworkTask {
  'id': number;
  'boardColumn': ITeamworkTaskBoardColumn;
  'content': string;
  'responsiblePartyIds'?: string;
  'description': string;
  'createdOn': string;
  'lastChangedOn': string;
  'assignees': ITeamworkTaskAssignee[];
  'projects'?: string;
  'projectId'?: string;

}
export interface ITeamworkTaskBoardColumn {
  'id': number;
  'name': string;
  'color': string;
}
export interface ITeamworkItem {
  id: string;
}
export interface ITeamworkTaskAssignee {
  'id'?: string;
}
