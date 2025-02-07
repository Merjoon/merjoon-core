import https from 'https';

export interface IGitLabConfig {
    token: string;
    httpsAgent?: https.Agent;
}

export interface IGitLabQueryParams {
    startAt?: number;
    page?: number;
    owned?: boolean;
}

export interface IGitLabTask {
    id: string;
    remote_id: string;
    name: string;
    assignees: string[];
    status: string;
    description: string;
    projects: string[];
    remote_created_at?: number;
    remote_modified_at?: number;
    ticket_url:string;
}

export interface IGitLabUser {
    id: string;
    username:string;
    name: string;
    state: string;
    locked: boolean;
    avatar_url: string;
    web_url: string;
}

export interface IGitLabProject {
    id:string;
    remote_id: string;
    remote_created_at:string
    remote_modified_at:string;
    name: string;
    description: string;
}

export type IMerejoonGitLabProjects = IGitLabProject[];
export type IMerejoonGitLabUsers = IGitLabUser[];
export type IMerejoonGitLabTasks = IGitLabTask[];
