export interface IGitLabConfig {
    token: string;
    httpsAgent?:IGitLabConfigHttpsAgent;
    limit?: number;
}
export interface IGitLabConfigHttpsAgent {
    maxSockets?: number;
}
export interface IGitLabQueryParams {
    page?: number;
    per_page?: number;
    owned?: boolean
}
export interface groupId {
    id:number;
}

export enum GitlabApiPath {
    Issues = 'issues',
    Projects = 'projects',
    Groups = 'groups',
    Members='members',
}
export interface IGitLabIssue {
    id: string;
    name: string;
    assignees: string[];
    labels: string;
    description: string;
    projects: string[];
    created_at?: number;
    updated_at?: number;
    web_url:string;
}
export interface IGroup {
    id: string;
}
export interface IMember{
    id:number;
    name: string;
}
export interface IGitLabProject {
    id:string;
    created_at:string
    last_activity_at:string;
    name: string;
    description: string;
}
