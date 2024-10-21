import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from "../common/types";
import { JiraApi } from "./api";
import { JiraTransformer } from "./transformer";
import {IJiraIssue, IJiraIssuesResponse, IJiraProject, IJiraProjectsResponse, IJiraUser, JiraApiPath } from "./types"

export class JiraService implements IMerjoonService {
  constructor(public readonly api: JiraApi, public readonly transformer: JiraTransformer) {}

  protected async* getAllRecordsIterator<T>(path: JiraApiPath, pageSize = 2, filterResponse: (response: any) => T[]) {
    let currentPage = 0;
    let isLast = false;
    do {
      try {
        const response: T[] = await this.api.sendGetRequest(path, {
            startAt: currentPage * pageSize,
            maxResults: pageSize
        });
        const data: T[] = filterResponse(response);
        yield data;
        isLast = data.length < pageSize;
        currentPage++;
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!isLast)
  }

  protected async getAllProjects(path: JiraApiPath.ProjectSearch, pageSize = 2) {

    const iterator: AsyncGenerator<IJiraProject[]> = this.getAllRecordsIterator(path, pageSize, (response:IJiraProjectsResponse)=> response.values)

    let records: IJiraProject[] = [];

    for await (const nextChunk of iterator) {
        records = records.concat(nextChunk);
    }

    return records;
  }

  protected async getAllUsers(path: JiraApiPath.UsersSearch, pageSize = 2) {

    const iterator: AsyncGenerator<IJiraUser[]> = this.getAllRecordsIterator(path, pageSize, (response: IJiraUser[])=> response)

    let records: IJiraUser[] = [];

    for await (const nextChunk of iterator) {
        records = records.concat(nextChunk);
    }
    return records;
  }

  protected async getAllIssues(path: JiraApiPath.Search, pageSize = 2) {

    const iterator: AsyncGenerator<IJiraIssue[]> = this.getAllRecordsIterator(path, pageSize, (response: IJiraIssuesResponse) => response.issues)

    let records: IJiraIssue[] = [];

    for await (const nextChunk of iterator) {
        records = records.concat(nextChunk);
    }

    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
      const projects = await this.getAllProjects(JiraApiPath.ProjectSearch);
      return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
      const allUsers = await this.getAllUsers(JiraApiPath.UsersSearch);
      const users = allUsers.filter(user => user.accountType === "atlassian")
      return this.transformer.transformUsers(users);
    }
  
  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.getAllIssues(JiraApiPath.Search);
    issues.forEach(issue => {
      issue.descriptionStr = JSON.stringify(issue.fields.description)
    })
    return this.transformer.transformIssues(issues);
  }
}