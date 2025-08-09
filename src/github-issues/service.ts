import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GithubIssuesApi } from './api';
import { GithubIssuesTransformer } from './transformer';

export class GithubIssuesService implements IMerjoonService {
  constructor(
    public readonly api: GithubIssuesApi,
    public readonly transformer: GithubIssuesTransformer,
  ) {}

  public async init() {
    return;
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const userAllOrgs = await this.api.getUserAllOrgs();
    const orgId = userAllOrgs[0].id;
    const projects = await this.api.getAllReposByOrgId(orgId);
    return this.transformer.transformProjects(projects);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const userAllOrgs = await this.api.getUserAllOrgs();
    const orgId = userAllOrgs[0].id;
    const users = await this.api.getAllMembersByOrgId(orgId);
    return this.transformer.transformUsers(users);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const userAllOrgs = await this.api.getUserAllOrgs();
    const orgId = userAllOrgs[0].id;
    const users = await this.api.getAllMembersByOrgId(orgId);
    const projects = await this.api.getAllReposByOrgId(orgId);
    const tasks = await this.api.getRepoAllIssues(users[0].login, projects[0].name);
    return this.transformer.transformTasks(tasks);
  }
}
