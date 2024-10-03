export interface IHeightConfig {
  secret: string;
}

export interface IHeightQueryParams {
  page: number;
  pageSize: number;
}

export enum HeightApiPath {
  People = "users",
  Projects = "lists",
  Tasks = "tasks",
}

export interface IHeightUser {
  createdAt: string;
  id: string;
  model: string;
  hue: number;
  auth: string[];
  pictureUrl: string | null;
  key: string;
  access: string;
  admin: boolean;
  deleted: boolean;
  state: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  signedUpAt?: string;
  botType?: string;
}

export interface IHeightList {
  id: string;
  name: string;
  description: string;
  "created-on": string;
  "last-changed-on": string;
}

export interface IHeightTask {
  id: number;
  content: string;
  "creator-id": number;
  boardColumn: {
    id: number;
    name: string;
    color: string;
  };
  description: string;
  "project-id": number;
  "created-on": string;
  "last-changed-on": string;
  priority: string;
}
