import https from 'https';

export interface IMerjoonProject {
  id: string;
  remote_id: string;
  name: string;
  description: string;
  remote_created_at?: number;
  remote_modified_at?: number;
}

export interface IMerjoonUser {
  id: string;
  remote_id: string;
  name: string;
  email_address: string;
  remote_created_at?: number;
  remote_modified_at?: number;
}

export interface IMerjoonTask {
  id: string;
  remote_id: string;
  name: string;
  assignees:string[];
  status: string;
  description: string;
  projects:string[];
  remote_created_at?: string;
  remote_updated_at?: string;
  priority: string;
}

export type IMerjoonEntity = IMerjoonUser | IMerjoonTask | IMerjoonProject;

export type IMerjoonProjects = IMerjoonProject[];
export type IMerjoonUsers = IMerjoonUser[];
export type IMerjoonTasks = IMerjoonTask[];

export interface IMerjoonService {
  api: IMerjoonHttpClient;
  transformer: IMerjoonTransformer;

  getProjects(): Promise<IMerjoonProjects>;
  getUsers(): Promise<IMerjoonUsers>;
  getTasks(): Promise<IMerjoonTasks>;
}

export interface IMerjoonProjectsTransform {
  id: string;
  remote_id: string;
  remote_created_at?: string;
  remote_modified_at?: string;
  name: string;
  description?: string;
}

export interface IMerjoonUsersTransform {
  id: string;
  remote_id: string;
  remote_created_at?: string;
  remote_modified_at?: string;
  name: string;
  email_address: string;
}

export interface IMerjoonTasksTransform {
  id: string;
  remote_id: string;
  name: string;
  status: string;
  '[assignees]':string;
  description: string;
  '[projects]': string;
  remote_created_at: string;
  remote_modified_at: string;
  ticket_url?: string;
}

export interface IRequestConfig {
  headers?: Record<string, string>
}

export interface IGetRequestParams {
  path: string;
  base?: string;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  queryParams?: any;
  config?: IRequestConfig;
}

export interface IMerjoonHttpClient {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  get(params: IGetRequestParams): Promise<any>
}
export interface IMerjoonTransformer {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  transform(data: any[], config: Record<string, any>): any[]
}

export interface IMerjoonTransformConfig {
  projects: IMerjoonProjectsTransform;
  users: IMerjoonUsersTransform;
  tasks: IMerjoonTasksTransform;
}

export interface IMerjoonApiConfig {
  baseURL: string;
  httpsAgent?: https.Agent;
  headers?: Record<string, string>;
}
