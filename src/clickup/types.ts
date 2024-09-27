export type IClickUpConfig = {
    api_key: string;
    list_id: string;
    team_id: string;
    folder_id: string;
    space_id: string;
}

export type ITeamworkQueryParams = {
    page: number;
    pageSize: number;
}

export enum ClickUpApiPath {
    People = 'member',
    Projects = 'list',
    Tasks = 'task',
}
export enum ClickUpSubdomain {
}
export interface ITeamworkPeople {
    'id': number;
    'username': string;
    'email': string;
}

export interface ITeamworkProject {
    'id': string;
    'name': string;
    'content': string;
}

export interface ITeamworkTask {
    'id': string;
    'name': string;
    'assignees': ITeamworkTaskAssignee[];
    'status': ITeamworkTaskStatus;
    'description': string;
    'list': ITeamworkTaskList;
    'date_created': string;
    'date_updated': string;
}

export interface ITeamworkTaskAssignee {
    'id': string;
}

export interface ITeamworkTaskStatus {
    status: string;
}

export interface ITeamworkTaskList {
    'id': string;
}