import { HttpClient } from '../common/HttpClient';
import {
  IJiraConfig,
  IJiraQueryParams,
  IJiraGetAllRecordsEntity,
  JiraApiPath,
} from './types';

export class JiraApi extends HttpClient {

  protected readonly encodedCredentials: string;
  public readonly limit: number;

  constructor (config: IJiraConfig) {
    const basePath = `https://${config.subdomain}.atlassian.net/rest/api/3`;
    super(basePath);
    this.encodedCredentials = Buffer.from(`${config.email}:${config.token}`).toString('base64');
    this.limit = config.limit;
  }

  protected async* getAllRecordsIterator(path: JiraApiPath)  {
    let currentPage = 0;
    let isLast = false;
    const limit = this.limit;
    do {
      try {
        let data = await this.sendGetRequest(path, {
          startAt: currentPage * limit,
          maxResults: limit
        });
        if (!Array.isArray(data)) {
          data = data.issues || data.values;
        }
        yield data;
        isLast = data.length < limit;
        currentPage++;
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(e.message);
        } else {
          throw e;
        }
      }
    } while (!isLast);
  }

  protected async getAllRecords<T extends JiraApiPath>(path: T) {
    const iterator= this.getAllRecordsIterator(path);
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
    return this.getAllRecords(JiraApiPath.Search);
  }

  public async sendGetRequest(path: JiraApiPath, queryParams?: IJiraQueryParams) {
    const config = {
      headers: {
        'Authorization': `Basic ${this.encodedCredentials}`
      }
    };
    return this.get({
      path,
      config,
      queryParams
    });

  }
}
