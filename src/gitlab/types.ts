export interface IGitLabConfig {
    token: string;
    httpsAgent?:IClickUpConfigHttpsAgent;
}
export interface IClickUpConfigHttpsAgent {
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
    GroupMembers='members',
}

export type IGitLabGetAllRecordsEntity<T> =
  T extends GitlabApiPath.Issues ? IGitLabIssues :
    T extends GitlabApiPath.Projects ? IGitLabProject :
      T extends GitlabApiPath.Groups ? IGroups :
        never;
export interface IGitLabIssues {
    id: string;
    name: string;
    assignees: string[];
    status: string;
    description: string;
    projects: string[];
    created_at?: number;
    modified_at?: number;
    ticket_url:string;
}
export interface IGroups {
    id: string;
}
export interface IMembersByGroupId {
    name: string;
    id: number;
}
export interface IGitLabProject {
    id:string;
    created_at:string
    modified_at:string;
    name: string;
    description: string;
}
