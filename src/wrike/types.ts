export interface IWrikeConfig {
  limit: number;
  token: string;
}

export interface IWrikeUser {
  id: string;
  lastName: string;
  firstName: string;
  primaryEmail: string;
}
export interface IWrikeTask {
  id: string;
  title: string;
  responsibleIds: string[];
  status: string[];
  description: string;
  parentIds: string[];
  createdDate: string;
  updatedDate: string;
  permalink: string;
}

export interface IWrikeProject {
  id: string;
  name: string;
}

export enum WrikeApiPath {
  Contacts = 'contacts',
  Projects = 'folders',
  Tasks = 'tasks',
}

export interface IWrikeGetTasksResponse<T> {
  data: T[];
  nextPageToken?: string;
  responseSize?: number;
}

export interface IWrikeQueryParams {
  fields?: string;
  pageSize?: number;
}
