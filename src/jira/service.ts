import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from "../common/types";
import { JiraApi } from "./api";
import { JiraTransformer } from "./transformer";
import {GetJiraEntity, IJiraIssue, IJiraProject, IJiraUser, JiraApiPath } from "./types"

export class JiraService implements IMerjoonService {
  constructor(public readonly api: JiraApi, public readonly transformer: JiraTransformer) {}

  protected async* getAllRecordsIterator<T>(path: JiraApiPath, entity: GetJiraEntity) {
    let currentPage = 0;
    let isLast = false;
    const pageSize = Number(this.api.pageSize)
    do {
      try {
        const response: T[] = await this.api[entity](path, {
            startAt: currentPage * pageSize,
            maxResults: pageSize
        });
        const data: T[] = response
        yield data;
        isLast = data.length < pageSize;
        currentPage++;
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!isLast)
  }

  protected async getAllRecords<T>(path: JiraApiPath, entity: GetJiraEntity): Promise<T[]> {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const iterator: AsyncGenerator<any> = this.getAllRecordsIterator<T>(path, entity);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }


  public async getProjects(): Promise<IMerjoonProjects> {
      const projects = await this.getAllRecords<IJiraProject>(JiraApiPath.ProjectSearch, GetJiraEntity.Projects);
      return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const allUsers = await this.getAllRecords<IJiraUser>(JiraApiPath.UsersSearch, GetJiraEntity.Users);
    const users = allUsers.filter(user => user.accountType === "atlassian")
    return this.transformer.transformUsers(users);
  }
  
  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.getAllRecords<IJiraIssue>(JiraApiPath.Search, GetJiraEntity.Issues);
    issues.forEach(issue => {
      issue.fields.descriptionStr = JSON.stringify(issue.fields.description)
    })
    return this.transformer.transformIssues(issues);
  }
}