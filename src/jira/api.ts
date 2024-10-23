import { HttpClient } from "../common/HttpClient";
import { IJiraConfig, IJiraIssue, IJiraIssuesResponse, IJiraProject, IJiraProjectsResponse, IJiraQueryParams, IJiraUser, IJiraUsersResponse, JiraApiPath } from "./types";
export class JiraApi extends HttpClient {

    protected readonly encodedCredentials: string;
    public readonly pageSize: number

    constructor (config: IJiraConfig) {
        const basePath = `https://${config.subdomain}.atlassian.net/rest/api/3`
        super(basePath)
        this.encodedCredentials = Buffer.from(`${config.email}:${config.token}`).toString('base64')
        this.pageSize = config.pageSize ?? 50
    }

    public async getProjects(path: JiraApiPath, queryParams?: IJiraQueryParams): Promise<IJiraProject[]> {
      const response: IJiraProjectsResponse = await this.sendGetRequest(path, queryParams)
      return response.values as IJiraProject[]
    }

    public async getUsers(path: JiraApiPath, queryParams?: IJiraQueryParams): Promise<IJiraUser[]> {
      const response: IJiraUsersResponse = await this.sendGetRequest(path, queryParams)
      return response as IJiraUser[]
    }

    public async getIssues(path: JiraApiPath, queryParams?: IJiraQueryParams): Promise<IJiraIssue[]> {
      const response: IJiraIssuesResponse = await  this.sendGetRequest(path, queryParams)
      return response.issues as IJiraIssue[]
    }

    public async sendGetRequest(path: JiraApiPath, queryParams?: IJiraQueryParams) {
      const config = {
        headers: {
          'Authorization': `Basic ${this.encodedCredentials}`
        }
      }
      const response = await this.get({
        path,
        config,
        queryParams
      })
      
      return response
    }
}