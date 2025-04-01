import { HttpClient } from '../common/HttpClient';
import {
  IJiraConfig,
  IJiraIssue,
  IJiraProject,
  IJiraQueryParams,
  IJiraResponse,
  IJiraUser,
} from './types';
import { JIRA_PATHS } from './consts';
import { IMerjoonApiConfig } from '../common/types';

export class JiraApi extends HttpClient {
  public readonly limit: number;

  constructor(config: IJiraConfig) {
    const basePath = `https://${config.subdomain}.atlassian.net/rest/api/3`;
    const encodedCredentials = Buffer.from(`${config.email}:${config.token}`).toString('base64');
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    };
    super(apiConfig);

    this.limit = config.limit || 50;
  }

  protected async *getAllRecordsIterator<T>(path: string) {
    let currentPage = 0;
    let isLast = false;
    const limit = this.limit;
    do {
      const response = await this.getRecords<IJiraResponse<T>>(path, {
        startAt: currentPage * limit,
        maxResults: limit,
      });

      const data: T[] = Array.isArray(response)
        ? response
        : (response.issues ?? response.values ?? []);
      yield data;
      isLast = data.length < limit;
      currentPage++;
    } while (!isLast);
  }

  protected async getAllRecords<T>(path: string) {
    const iterator = this.getAllRecordsIterator<T>(path);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords<T>(path: string, params?: IJiraQueryParams) {
    return this.sendGetRequest<T>(path, params);
  }
  getAllProjects() {
    return this.getAllRecords<IJiraProject>(`${JIRA_PATHS.PROJECT}`);
  }
  getAllUsers() {
    return this.getAllRecords<IJiraUser>(`${JIRA_PATHS.USERS}`);
  }
  getAllIssues() {
    return this.getAllRecords<IJiraIssue>(`${JIRA_PATHS.SEARCH}`);
  }

  public async sendGetRequest<T>(path: string, queryParams?: IJiraQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }
}
