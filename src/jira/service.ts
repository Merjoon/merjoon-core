import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { JiraApi } from './api';
import { JiraTransformer } from './transformer';
import { GetJiraEntity, IJiraIssue, IJiraProject, IJiraUser } from './types';

export class JiraService implements IMerjoonService {
  constructor(public readonly api: JiraApi, public readonly transformer: JiraTransformer) {}

  protected async* getAllRecordsIterator<T>(entity: GetJiraEntity)  {
    let currentPage = 0;
    let isLast = false;
    const limit = Number(this.api.limit);
    do {
      try {
        const data = (await this.api[entity]({
          startAt: currentPage * limit,
          maxResults: limit
        })) as T[];
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

  protected async getAllRecords<T>(entity: GetJiraEntity): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator<T>(entity);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }


  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<IJiraProject>(GetJiraEntity.Projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const allUsers = await this.getAllRecords<IJiraUser>(GetJiraEntity.Users);
    const users = allUsers.filter(user => user.accountType === 'atlassian');
    return this.transformer.transformUsers(users);
  }
  
  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.getAllRecords<IJiraIssue>(GetJiraEntity.Issues);
    issues.forEach(issue => {
      issue.fields.descriptionStr = JSON.stringify(issue.fields.description);
    });
    return this.transformer.transformIssues(issues);
  }
}