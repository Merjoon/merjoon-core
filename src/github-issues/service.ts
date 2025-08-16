import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GithubIssuesApi } from './api';
import { GithubIssuesTransformer } from './transformer';
import { IGithubIssuesRepo } from './types';

export class GithubIssuesService implements IMerjoonService {
  protected orgLogins?: string[];
  protected allRepos?: IGithubIssuesRepo[];

  constructor(
    public readonly api: GithubIssuesApi,
    public readonly transformer: GithubIssuesTransformer,
  ) {}

  public async init() {
    const userAllOrgs = await this.api.getUserAllOrgs();
    this.orgLogins = userAllOrgs.map((userOrg) => userOrg.login);
    const orgAllRepos = await Promise.all(
      this.orgLogins.map((orgLogin) => this.api.getAllReposByOrgLogin(orgLogin)),
    );
    this.allRepos = orgAllRepos.flat();
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.fetchAllOrgsProjects();
    return this.transformer.transformProjects(projects);
  }
  protected async fetchAllOrgsProjects() {
    if (!this.orgLogins) {
      throw new Error('Missing organization');
    }
    const projects = await Promise.all(
      this.orgLogins.map((orgLogin) => this.api.getAllReposByOrgLogin(orgLogin)),
    );
    return projects.flat();
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.fetchAllOrgsUsers();
    return this.transformer.transformUsers(users);
  }
  protected async fetchAllOrgsUsers() {
    if (!this.orgLogins) {
      throw new Error('Missing organization');
    }
    const users = await Promise.all(
      this.orgLogins.map((orgLogin) => this.api.getAllMembersByOrgLogin(orgLogin)),
    );
    return users.flat();
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.fetchAllReposTasks();
    return this.transformer.transformTasks(tasks);
  }
  protected async fetchAllReposTasks() {
    if (!this.allRepos) {
      throw new Error('Missing organization');
    }
    const tasks = await Promise.all(
      this.allRepos.map((repo) => this.api.getRepoAllIssues(repo.owner.login, repo.name)),
    );
    return tasks.flat();
  }
}
