import { HttpClient } from '../common/HttpClient';
import { IJiraConfig, IJiraIssue, IJiraIssuesResponse, IJiraProject, IJiraProjectsResponse, IJiraQueryParams, IJiraUser, IJiraUsersResponse, JiraApiPath } from './types';
export class JiraApi extends HttpClient {

  protected readonly encodedCredentials: string;
  public readonly limit: number;

  constructor (config: IJiraConfig) {
    const basePath = `https://${config.subdomain}.atlassian.net/rest/api/3`;
    super(basePath);
    this.encodedCredentials = Buffer.from(`${config.email}:${config.token}`).toString('base64');
    this.limit = config.limit;
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