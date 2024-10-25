import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { JiraApi } from './api';
import { JiraTransformer } from './transformer';
import { GetJiraEntity, IJiraIssue, IJiraProject, IJiraUser } from './types';

export class JiraService implements IMerjoonService {
  constructor(public readonly api: JiraApi, public readonly transformer: JiraTransformer) {}

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllRecords<IJiraProject>(GetJiraEntity.Projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const allUsers = await this.api.getAllRecords<IJiraUser>(GetJiraEntity.Users);
    const users = allUsers.filter(user => user.accountType === 'atlassian');
    return this.transformer.transformUsers(users);
  }
  
  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.api.getAllRecords<IJiraIssue>(GetJiraEntity.Issues);
    issues.forEach(issue => {
      issue.fields.descriptionStr = JSON.stringify(issue.fields.description);
    });
    return this.transformer.transformIssues(issues);
  }
}