import { HttpClient } from '../common/HttpClient';
import {
  IJiraConfig,
  IJiraQueryParams,
  IJiraRequestQueryParams,
  IJiraGetAllRecordsEntity,
  JiraApiPath,
} from './types';
import { IMerjoonApiConfig } from '../common/types';

export class JiraApi extends HttpClient {
  public readonly limit: number;

  constructor (config: IJiraConfig) {
    const basePath = `https://${config.subdomain}.atlassian.net/rest/api/3`;
    const encodedCredentials = Buffer.from(`${config.email}:${config.token}`).toString('base64');
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    };
    super(apiConfig);

    this.limit = config.limit;
  }

  protected async* getAllRecordsIterator(path: JiraApiPath, queryParams?: IJiraRequestQueryParams)  {
    let currentPage = 0;
    let isLast = false;
    const limit = this.limit;
    do {
      let data = await this.sendGetRequest(path, {
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

  protected async getAllRecords<T extends JiraApiPath>(path: T, queryParams?: IJiraRequestQueryParams) {
    const iterator= this.getAllRecordsIterator(path, queryParams);
    let records: IJiraGetAllRecordsEntity<T>[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  getAllProjects() {
    return this.getAllRecords(JiraApiPath.ProjectSearch);
  }
  getAllUsers() {
    return this.getAllRecords(JiraApiPath.UsersSearch);
  }
  getAllIssues() {
    return this.getAllRecords(JiraApiPath.Search, {
      expand: ['renderedFields'],
    });
  }

  public async sendGetRequest(path: JiraApiPath, queryParams?: IJiraQueryParams) {
    return this.get({
      path,
      queryParams
    });
  }
}
