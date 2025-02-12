import { HttpClient } from '../common/HttpClient';
import {
  IGitLabConfig,
  IGitLabQueryParams,
  GitlabApiPath,
  IGitLabGetAllRecordsEntity,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import * as https from 'https';

export class GitLab extends HttpClient {
  public readonly limit: number;
  constructor(protected config: IGitLabConfig) {
    const httpsAgent = config.httpsAgent ?? new https.Agent({
      keepAlive: true,
      maxSockets: 10,
    });
    const basePath = 'https://gitlab.com/api/v4';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'PRIVATE-TOKEN': `${config.token}`,
      },
      httpsAgent,
    };
    super(apiConfig);
    this.limit = config.limit ?? 10;
  }

  protected async* getAllRecordsInterator(path: GitlabApiPath, queryParams?: IGitLabQueryParams) {
    let currentPage = 1;
    let isLast = false;
    const limit = this.limit;
    do {
      const params = { ...queryParams, page: currentPage, per_page: limit };
      let data = await this.sendGetRequest(path, params);
      if (!Array.isArray(data)) {
        data = data.items || data;
      }
      yield data;
      isLast = data.length < limit;
      currentPage++;
    } while (!isLast);
  }

  protected async getAllRecords<T extends GitlabApiPath>(path: T, queryParams?: IGitLabQueryParams) {
    const iterator = this.getAllRecordsInterator(path, queryParams);
    let records: IGitLabGetAllRecordsEntity<T>[] = [];
    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }

  getAllIssues() {
    return this.getAllRecords(GitlabApiPath.issues);
  }

  getAllProjects() {
    return this.getAllRecords(GitlabApiPath.projects, { owned: true });
  }

  getAllGroups() {
    return this.getAllRecords(GitlabApiPath.groups);
  }

  public async sendGetRequest(path: string, queryParams?: IGitLabQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });
    return response;
  };
};