import { IMerjoonProjects, IMerjoonServiceBase, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { JiraApi } from './api';
import { JiraTransformer } from './transformer';
import { IJiraIssue } from './types';

export class JiraService implements IMerjoonServiceBase {
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
    const allProjects = await this.api.getAllProjects();
    const projectIds = allProjects.map((project) => project.id);
    const issues: IJiraIssue[] = await this.api.getAllIssuesByProjectIds(projectIds);
    return this.transformer.transformIssues(issues);
  }
}
