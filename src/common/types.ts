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
  email_address?: string;
  remote_created_at?: number;
  remote_modified_at?: number;
}

export interface IMerjoonTask {
  id: string;
  remote_id: string;
  name: string;
  assignees: string[];
  status: string;
  description: string;
  projects: string[];
  remote_created_at?: number;
  remote_updated_at?: number;
  priority: string;
}

export type IMerjoonEntity = IMerjoonUser | IMerjoonTask | IMerjoonProject;
export type IMerjoonProjects = IMerjoonProject[];
export type IMerjoonUsers = IMerjoonUser[];
export type IMerjoonTasks = IMerjoonTask[];

export interface IMerjoonService {
  api: IMerjoonHttpClient | IMerjoonHttpClients;
  transformer: IMerjoonTransformer;

  init(): Promise<void>;
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
  email_address?: string;
}

export interface IMerjoonTasksTransform {
  id: string;
  remote_id: string;
  name: string;
  '[assignees]': string;
  status: string;
  description: string;
  '[projects]': string;
  remote_created_at: string;
  remote_modified_at: string;
  ticket_url?: string;
}

export interface IRequestConfig {
  headers?: Record<string, string>;
}

export interface IResponseConfig<T> {
  data: T;
  status: number;
  headers: Record<string, IHeaderValue>;
}

export type IHeaderValue =
  | string
  | string[]
  | number[]
  | number
  | boolean
  | null
  | undefined
  | object;

export interface IGetRequestParams {
  path: string;
  base?: string;
  queryParams?: object;
  config?: IRequestConfig;
}
export interface IPostRequestParams<D> {
  path: string;
  base?: string;
  body?: D;
  config?: IRequestConfig;
}

export interface IMerjoonHttpClient {
  get<T>(params: IGetRequestParams): Promise<IResponseConfig<T>>;
}

export type IMerjoonHttpClients<T = object> = Record<keyof T, IMerjoonHttpClient>;

export interface IMerjoonTransformer {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  transform(data: any[], config: Record<string, string>): IMerjoonEntity[];
}

export interface IMerjoonTransformConfig {
  projects: IMerjoonProjectsTransform;
  users: IMerjoonUsersTransform;
  tasks: IMerjoonTasksTransform;
}

export interface IMerjoonApiConfig {
  baseURL: string;
  httpAgent?: IHttpAgent;
  headers?: Record<string, string>;
  maxRetries?: number;
}

export interface IHttpAgent {
  maxSockets?: number;
  keepAlive?: boolean;
}
export type HttpMethod = 'get' | 'GET' | 'post' | 'POST';

export interface IHttpRequestConfig<T = unknown> {
  url?: string;
  method?: HttpMethod;
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, T>;
  data?: T;
}
export type ConvertibleValueType = string | number | null | undefined | object;

export type ToTimestampParamsType = [ConvertibleValueType, TimestampUnitType];

export type TimestampUnitType = 's' | 'ms' | 'iso';
