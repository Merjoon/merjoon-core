import { HttpClient } from '../common/HttpClient';
import {
  IGitLabConfig,
  IGitLabQueryParams,
  IMember,
  IGitLabIssue,
  IGroup,
  IGitLabProject,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITLAB_PATH } from './consts';
import https from 'https';

export class GitLab extends HttpClient {
  public readonly limit: number;
  constructor(protected config: IGitLabConfig) {
    const basePath = 'https://gitlab.com/api/v4';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'PRIVATE-TOKEN': `${config.token}`,
      },
    };
    if (config.httpsAgent) {
      const agent = new https.Agent({
        keepAlive: true,
        maxSockets: config.httpsAgent.maxSockets,
      });
      apiConfig.httpsAgent = agent;
    }
    super(apiConfig);
    this.limit = config.limit ?? 20;
  }
  async* getAllRecordsInterator(path: string, queryParams?: IGitLabQueryParams) {
    let currentPage = 1;
    let isLast = false;
    const limit = this.limit ||10;
    do {
      const params:IGitLabQueryParams= { ...queryParams, page: currentPage, per_page: limit };
      const data = await this.getRecords(path, params);
      yield data;
      isLast = data.length < limit;
      currentPage++;
    } while (!isLast);
  }
  public getRecords(path: string, params?: IGitLabQueryParams) {
    return this.sendGetRequest(path, params);
  }
  protected async getAllRecords<T>(path: string, queryParams?: IGitLabQueryParams): Promise<T[]> {
    const iterator = this.getAllRecordsInterator(path, queryParams);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getAllIssues():Promise<IGitLabIssue[]> {
    return this.getAllRecords<IGitLabIssue>(GITLAB_PATH.ISSUES);
  }

  public getAllProjects(): Promise<IGitLabProject[]> {
    return this.getAllRecords<IGitLabProject>(GITLAB_PATH.PROJECTS, { owned: true });
  }

  public getAllGroups():Promise<IGroup[]> {
    return this.getAllRecords<IGroup>(GITLAB_PATH.GROUPS);
  }
  public  async getAllMembersByGroupId(id:string):Promise<IMember[]> {
    const path = GITLAB_PATH.MEMBERS(id);
    return this.getAllRecords<IMember>(path);
  }

  protected async sendGetRequest(path: string, queryParams?: IGitLabQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });
    return response;
  }};
