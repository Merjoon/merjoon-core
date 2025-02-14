import { HttpClient } from '../common/HttpClient';
import {
  IGitLabConfig,
  IGitLabQueryParams,
  GitlabApiPath,
  IGitLabGetAllRecordsEntity,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITLAB_PATH } from './consts';
import https from 'https';

export class GitLab extends HttpClient {
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
  }

  protected async* getAllRecordsInterator(path: string, queryParams?: IGitLabQueryParams) {
    let currentPage = 1;
    let isLast = false;
    const limit = 100;
    do {
      const params = { ...queryParams, page: currentPage, per_page: limit };
      const data = await this.sendGetRequest(path, params);
      yield data;
      isLast = data.length < limit;
      currentPage++;
    } while (!isLast);
  }

  protected async getAllRecords<T extends GitlabApiPath | string>(
    path: T,
    queryParams?: IGitLabQueryParams
  ): Promise<IGitLabGetAllRecordsEntity<T>[]> {
    const iterator = this.getAllRecordsInterator(path, queryParams);
    let records: IGitLabGetAllRecordsEntity<T>[] = [];
    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }
  protected getAllIssues() {
    return this.getAllRecords(GITLAB_PATH.ISSUES);
  }

  protected getAllProjects() {
    return this.getAllRecords(GITLAB_PATH.PROJECTS, { owned: true });
  }

  protected IGitlabGroup() {
    return this.getAllRecords(GITLAB_PATH.GROUPS);
  }
  protected async getMembersByGroupId() {
    const groups = await this.IGitlabGroup(); // Fetch the groups
    const memberRequests = groups.map(group => {
      const path = GITLAB_PATH.MEMBERS(group.id) as GitlabApiPath;
      return this.getAllRecords(path);
    });

    return Promise.all(memberRequests);
  }

  public async sendGetRequest(path: string, queryParams?: IGitLabQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });
    return response;
  }
}
