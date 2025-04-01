import { HttpClient } from '../common/HttpClient';
import { IJiraConfig, IJiraQueryParams, IJiraRequestQueryParams } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { JIRA_PATH } from './consts';

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

  protected async *getAllRecordsIterator(path: string, queryParams?: IJiraRequestQueryParams) {
    let currentPage = 0;
    let isLast = false;
    const limit = this.limit;
    do {
      let data = await this.getRecords(path, {
        startAt: currentPage * limit,
        maxResults: limit,
        ...queryParams,
      });
      if (!Array.isArray(data)) {
        data = data.issues || data.values;
      }
      yield data;
      isLast = data.length < limit;
      currentPage++;
    } while (!isLast);
  }

  protected async getAllRecords(path: string, queryParams?: IJiraRequestQueryParams) {
    const iterator = this.getAllRecordsIterator(path, queryParams);
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    let records: any[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords(path: string, params?: IJiraQueryParams) {
    return this.sendGetRequest(path, params);
  }
  getAllProjects() {
    return this.getAllRecords(JIRA_PATH.PROJECTS);
  }
  getAllUsers() {
    return this.getAllRecords(JIRA_PATH.USERS);
  }
  getAllIssues() {
    return this.getAllRecords(JIRA_PATH.ISSUES, {
      expand: ['renderedFields'],
    });
  }

  public async sendGetRequest(path: string, queryParams?: IJiraQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });

    return response.data;
  }
}
