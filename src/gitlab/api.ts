import https from 'https';
import { HttpClient } from '../common/HttpClient';
import {
  IGitLabConfig,
  IGitLabQueryParams,
  IGitLabMember,
  IGitLabIssue,
  IGitLabProject, IGitLabGroup,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITLAB_PATH } from './consts';

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
    this.limit = config.limit ?? 100;
  }
  async* getAllRecordsInterator(path: string, queryParams?: IGitLabQueryParams) {
    let currentPage = 1;
    let isLast = false;

    const limit = this.limit;
    while (!isLast) {
      const params:IGitLabQueryParams = { ...queryParams, page: currentPage, per_page: limit };
      const data = await this.getRecords(path, params);
      isLast = data.length < limit;
      currentPage++;
      yield { data, isLast };
    }
  }
  public getRecords(path: string, params?: IGitLabQueryParams) {
    return this.sendGetRequest(path, params);
  }
  protected async getAllRecords<T>(path: string, queryParams?: IGitLabQueryParams): Promise<T[]> {
    const iterator = this.getAllRecordsInterator(path, queryParams);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk.data);
    }

    return records;
  }

  public async getAllIssues() {
    return this.getAllRecords<IGitLabIssue>(GITLAB_PATH.ISSUES);
  }

  public getAllProjects() {
    return this.getAllRecords<IGitLabProject>(GITLAB_PATH.PROJECTS, { owned: true });
  }

  public getAllGroups() {
    return this.getAllRecords<IGitLabGroup>(GITLAB_PATH.GROUPS);
  }
  public  async getAllMembersByGroupId(id:string) {
    const path = GITLAB_PATH.MEMBERS(id);
    return this.getAllRecords<IGitLabMember>(path);
  }

  protected async sendGetRequest(path: string, queryParams?: IGitLabQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }
}
