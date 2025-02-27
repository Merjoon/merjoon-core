export interface IWrikeConfig {
    token: string;
    httpsAgent?: IWrikeConfigHttpsAgent;
}

export interface IWrikeConfigHttpsAgent {
    maxSockets?: number;
}

export interface IWrikeUser {
    lastName: string;
    firstName: string;
    fullName: string;
    id: string;
    primaryEmail: string;
}
export interface IWrikeTasks {
    id: string;
    title: string;
    assignees: string[] | null;
    status: string;
    description: string;
    parentIds: string;
    createdAt: string;
    modifiedAt: string;
    permalink: string
}

export interface IWrikeProject {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    modifiedAt: string;
}

export enum WrikeApiPath {
    Users = 'contacts',
    Projects = 'folders',
    Tasks = 'tasks'
}

export interface IWrikeQueryParams {
    fields?: string;
    project?: boolean
}
