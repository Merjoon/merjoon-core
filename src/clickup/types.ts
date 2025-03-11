export interface IClickUpConfig {
  apiKey: string;
  httpsAgent?: IClickUpConfigHttpsAgent;
}

export interface IClickUpConfigHttpsAgent {
  maxSockets?: number;
}

export interface IClickUpMember {
  id: number;
  username: string;
  email: string;
}

export interface IClickUpList {
  id: string;
  name: string;
  content: string;
}

export interface IClickUpTask {
  id: string;
  name: string;
  assignees: IClickUpTaskAssignee[];
  status: IClickUpTaskStatus;
  description: string;
  list: IClickUpTaskList;
  date_created: string;
  date_updated: string;
}

export interface IClickUpTaskAssignee {
  id: string;
}

export interface IClickUpTaskStatus {
  status: string;
}

export interface IClickUpTaskList {
  id: string;
}

export interface IClickUpItem {
  id: string;
}

export interface IClickUpTeamResponse {
  teams: IClickUpTeam[];
}

export interface IClickUpSpaceResponse {
  spaces: IClickUpItem[];
}

export interface IClickUpFolderResponse {
  folders: IClickUpItem[];
}

export interface IClickUpListResponse {
  lists: IClickUpList[];
}

export interface IClickUpTaskResponse {
  tasks: IClickUpTask[];
  last_page: boolean;
}

export interface IClickUpQueryParams {
  page: number;
}

export interface IClickUpTeam {
  id: string;
  members: IClickUpTeamMember[];
}

export interface IClickUpTeamMember {
  user: IClickUpMember;
}

export type IClickUpLists = IClickUpList[];
export type IClickUpMembers = IClickUpMember[];
export type IClickUpTasks = IClickUpTask[];

export enum ClickUpApiPath {
  Team = 'team',
  Space = 'space',
  Folder = 'folder',
  List = 'list',
  Task = 'task',
}
