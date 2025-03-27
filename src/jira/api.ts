import { HttpClient } from '../common/HttpClient';
import { IJiraConfig, IJiraQueryParams, IJiraGetAllRecordsEntity, JiraApiPath } from './types';
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

  protected async *getAllRecordsIterator(path: JiraApiPath) {
    let currentPage = 0;
    let isLast = false;
    const limit = this.limit;
    do {
      let data = await this.getRecords(path, {
        startAt: currentPage * limit,
        maxResults: limit,
      });
      if (!Array.isArray(data)) {
        data = data.issues || data.values;
      }
      yield data;
      isLast = data.length < limit;
      currentPage++;
    } while (!isLast);
  }

  protected async getAllRecords<T extends JiraApiPath>(path: T) {
    const iterator = this.getAllRecordsIterator(path);
    let records: IJiraGetAllRecordsEntity<T>[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords(path: JiraApiPath, params?: IJiraQueryParams) {
    return this.sendGetRequest(path, params);
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

  public async sendGetRequest(path: JiraApiPath, queryParams?: IJiraQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });

    return response.data;
  }
}
