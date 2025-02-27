import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { JiraApi } from './api';
import { JiraTransformer } from './transformer';

export class JiraService implements IMerjoonService {
  constructor(
    public readonly api: JiraApi,
    public readonly transformer: JiraTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const allUsers = await this.api.getAllUsers();
    const users = allUsers.filter((user) => user.accountType === 'atlassian');
    return this.transformer.transformUsers(users);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.api.getAllIssues();
    issues.forEach((issue) => {
      issue.fields.descriptionStr = JSON.stringify(issue.fields.description);
    });
    return this.transformer.transformIssues(issues);
  }
}
