import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { JiraApi } from './api';
import { JiraTransformer } from './transformer';
import { IJiraIssue, IJiraProject, IJiraUser } from './types';

export class JiraService implements IMerjoonService {
  constructor(
    public readonly api: JiraApi,
    public readonly transformer: JiraTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = (await this.api.getAllProjects()) as IJiraProject[];
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const allUsers = (await this.api.getAllUsers()) as IJiraUser[];
    const users = allUsers.filter((user) => user.accountType === 'atlassian');
    return this.transformer.transformUsers(users);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = (await this.api.getAllIssues()) as IJiraIssue[];
    return this.transformer.transformIssues(issues);
  }
}
