import https from 'https';

export interface IGitLabConfig {
    token: string;
    httpsAgent?: https.Agent;
    limit?: number;
}

export interface IGitLabQueryParams {
    startAt?: number;
    page?: number;
    per_page?: number;
    owned?: boolean;
}
export enum GitlabApiPath {
    issues = 'issues',
    projects = 'projects',
    groups = 'groups',
}

export type IGitLabGetAllRecordsEntity<T extends GitlabApiPath> =
  T extends GitlabApiPath.issues ? IGitLabIssues:
    T extends GitlabApiPath.projects ? IGitLabProject :
      T extends GitlabApiPath.groups ? IGroups :
        never

export interface IGitLabIssues {
    id: string;
    name: string;
    assignees: string[];
    status: string;
    description: string;
    projects: string[];
    remote_created_at?: number;
    remote_modified_at?: number;
    ticket_url:string;
}
export interface IGroups {
    id: string;
}
export interface IGitLabProject {
    id:string;
    remote_created_at:string
    remote_modified_at:string;
    name: string;
    description: string;
}
