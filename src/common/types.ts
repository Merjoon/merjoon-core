export interface IMerjoonCollection {
  id: string;
  remote_id: string;
  name: string;
  description: string;
  remote_created_at: string;
  remote_modified_at: string;
}

export interface IMerjoonUser {
  id: string;
  remote_id: string;
  name: string;
  email_address: string;
  remote_created_at: string;
  remote_modified_at: string;
}

export interface IMerjoonTask {
  id: string;
  remote_id: string;
  name: string;
  assignees: string[];
  status: string;
  description: string;
  collections: string[];
  remote_created_at: string;
  remote_updated_at: string;
  priority: string;
}

export type IMerjoonCollections = Array<IMerjoonCollection>;
export type IMerjoonUsers = Array<IMerjoonUser>;
export type IMerjoonTasks = Array<IMerjoonTask>;

export interface IMerjoonService {
  api: IMerjoonHttpClient;
  transformer: IMerjoonTransformer;
  getCollections(): Promise<IMerjoonCollections>;
  getUsers(): Promise<IMerjoonUsers>;
  getTasks(): Promise<IMerjoonTasks>;
}

export interface IMerjoonCollectionsTransform {
  id: string;
  remote_id: string;
  name: string;
  description: string;
  remote_created_at: string;
  remote_modified_at: string;
}

export interface IMerjoonUsersTransform {
  id: string;
  remote_id: string;
  name: string;
  email_address: string;
  remote_created_at: string;
  remote_modified_at: string;
}

export interface IMerjoonTasksTransform {
  id: string;
  remote_id: string;
  name: string;
  status: string;
  description: string;
  remote_created_at: string;
  remote_updated_at: string;
  ticket_url?: string;
  priority: string;
  '[assignees]': string,
  '[projects]': string,
}

export type IRequestConfig = {
  headers?: Record<string, string>
}

export type IGetRequestParams = {
  path: string;
  base?: string;
  queryParams?: any;
  config?: IRequestConfig;
}

export interface IMerjoonHttpClient {
  get(params: IGetRequestParams): Promise<any>
}
export interface IMerjoonTransformer {
  transform(data: any[], config: { [k: string]: any }): any[]
}

export interface IMerjoonTransformConfig {
  collections: IMerjoonCollectionsTransform;
  users: IMerjoonUsersTransform;
  tasks: IMerjoonTasksTransform;
}
