export interface IClickUpConfig {
    apiKey: string;
}

export enum ClickUpApiPath {
    Members = 'member',
    Lists = 'list',
    Tasks = 'task',
}

export interface IClickUpMember {
    'id': number;
    'username': string;
    'email': string;
}

export interface IClickUpList {
    'id': string;
    'name': string;
    'content': string;
}

export interface IClickUpTask {
    'id': string;
    'name': string;
    'assignees': IClickUpTaskAssignee[];
    'status': IClickUpTaskStatus;
    'description': string;
    'list': IClickUpTaskList;
    'date_created': string;
    'date_updated': string;
}

export interface IClickUpTaskAssignee {
    'id': string;
}

export interface IClickUpTaskStatus {
    status: string;
}

export interface IClickUpTaskList {
    'id': string;
}

export interface IClickUpItem {
    'id': string;
}

export interface IClickUpTaskResponse {
    'tasks': IClickUpTask[];
    'lastPage': boolean;
}

export interface IClickUpQueryParams {
    'page': number;
}