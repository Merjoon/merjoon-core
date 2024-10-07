export type IClickUpConfig = {
    apiKey: string;
}

export enum ClickUpApiPath {
    Members = 'member',
    Lists = 'list',
    Tasks = 'task',
}

export const ClickUpSubdomain = {
    [ClickUpApiPath.Members]: 'list',
    [ClickUpApiPath.Lists]: ['folder', 'space'],
    [ClickUpApiPath.Tasks]: 'list',
    'space': 'team',
    'folder': 'space',
}

export const ClickUpTokenConfig = {
    'list': 'list_id',
    'folder': 'folder_id',
    'space': 'space_id',
    'team': 'team_id',
}

export interface IClickUpTokenConfig {
    space_ids: string[];
    folder_ids: string[];
    list_ids: string[];
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