import { HttpClient } from '../common/HttpClient';
import { GetJiraEntity, IJiraConfig, IJiraIssue, IJiraIssuesResponse, IJiraProject, IJiraProjectsResponse, IJiraQueryParams, IJiraUser, IJiraUsersResponse, JiraApiPath } from './types';
export class JiraApi extends HttpClient {

  protected readonly encodedCredentials: string;
  public readonly limit: number;

  constructor (config: IJiraConfig) {
    const basePath = `https://${config.subdomain}.atlassian.net/rest/api/3`;
    super(basePath);
    this.encodedCredentials = Buffer.from(`${config.email}:${config.token}`).toString('base64');
    this.limit = config.limit;
  }

  protected async* getAllRecordsIterator<T>(entity: GetJiraEntity)  {
    let currentPage = 0;
    let isLast = false;
    const limit = this.limit;
    do {
      try {
        const data = await this[entity]({
          startAt: currentPage * limit,
          maxResults: limit
        }) as T[];

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

  public async getAllRecords<T>(entity: GetJiraEntity): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator<T>(entity);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getProjects(queryParams?: IJiraQueryParams): Promise<IJiraProject[]> {
    const response: IJiraProjectsResponse = await this.sendGetRequest(JiraApiPath.ProjectSearch, queryParams);
    return response.values as IJiraProject[];
  }

  public async getUsers(queryParams?: IJiraQueryParams): Promise<IJiraUser[]> {
    const response: IJiraUsersResponse = await this.sendGetRequest(JiraApiPath.UsersSearch, queryParams);
    return response as IJiraUser[];
  }

  public async getIssues(queryParams?: IJiraQueryParams): Promise<IJiraIssue[]> {
    const response: IJiraIssuesResponse = await  this.sendGetRequest(JiraApiPath.Search, queryParams);
    return response.issues as IJiraIssue[];
  }

  public async sendGetRequest(path: JiraApiPath, queryParams?: IJiraQueryParams) {
    const config = {
      headers: {
        'Authorization': `Basic ${this.encodedCredentials}`
      }
    };
    const response = await this.get({
      path,
      config,
      queryParams
    });
      
    return response;
  }
}