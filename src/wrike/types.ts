export interface IWrikeConfig {
  limit: number;
  token: string;
}

export interface IWrikeUser {
  id: string;
  lastName: string;
  firstName: string;
  fullName: string;
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
  description: string;
  createdDate: string;
  updatedDate: string;
}

export enum WrikeApiPath {
  Contacts = 'contacts',
  Projects = 'folders',
  Tasks = 'tasks',
}

export interface IWrikeQueryParams {
  fields?: string;
  pageSize?: number;
}

export interface IWrikeTaskResponse {
  nextPageToken: string | null;
  data: [];
}
