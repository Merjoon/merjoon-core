import { HttpClient } from '../common/HttpClient';
import {
  IJiraConfig,
  IJiraQueryParams,
  IJiraGetAllRecordsEntity,
  JiraApiPath,
  IJiraResponseType,
} from './types';
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

  protected async *getAllRecordsIterator<T>(path: JiraApiPath) {
    let currentPage = 0;
    let isLast = false;
    const limit = this.limit;
    do {
      const response = await this.getRecords<IJiraResponseType<T>>(path, {
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

  protected async getAllRecords<P extends JiraApiPath, T extends IJiraGetAllRecordsEntity<P>>(
    path: P,
  ) {
    const iterator = this.getAllRecordsIterator<T>(path);
    let records: IJiraGetAllRecordsEntity<P>[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords<T>(path: JiraApiPath, params?: IJiraQueryParams) {
    return this.sendGetRequest<T>(path, params);
  }
  getAllProjects() {
    return this.getAllRecords(JiraApiPath.ProjectSearch);
  }
  getAllUsers() {
    return this.getAllRecords(JiraApiPath.UsersSearch);
  }
  getAllIssues() {
    return this.getAllRecords(JiraApiPath.Search);
  }

  public async sendGetRequest<T>(path: JiraApiPath, queryParams?: IJiraQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }
}
