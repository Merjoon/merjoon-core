import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GithubIssuesApi } from './api';
import { GithubIssuesTransformer } from './transformer';
import { IGithubIssuesRepo } from './types';

export class GithubIssuesService implements IMerjoonService {
  protected orgLogins?: string[];
  protected allRepositories?: IGithubIssuesRepo[];

  constructor(
    public readonly api: GithubIssuesApi,
    public readonly transformer: GithubIssuesTransformer,
  ) {}

  public async init() {
    const userAllOrgs = await this.api.getUserAllOrgs();
    this.orgLogins = userAllOrgs.map((userOrg) => userOrg.login);
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllOrgsProjects();
    return this.transformer.transformProjects(projects);
  }
  protected async getAllOrgsProjects() {
    if (!this.orgLogins) {
      throw new Error('Missing organization');
    }
    const projects = await Promise.all(
      this.orgLogins.map((orgLogin) => this.api.getAllReposByOrgLogin(orgLogin)),
    );
    return projects.flat();
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.getAllOrgsUsers();
    return this.transformer.transformUsers(users);
  }
  protected async getAllOrgsUsers() {
    if (!this.orgLogins) {
      throw new Error('Missing organization');
    }
    const users = await Promise.all(
      this.orgLogins.map((orgLogin) => this.api.getAllMembersByOrgLogin(orgLogin)),
    );
    return users.flat();
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllReposTasks();
    return this.transformer.transformTasks(tasks);
  }
  protected async getAllReposTasks() {
    if (!this.orgLogins) {
      throw new Error('Missing organization');
    }
    const repositories = await Promise.all(
      this.orgLogins.map((orgLogin) => this.api.getAllReposByOrgLogin(orgLogin)),
    );
    this.allRepositories = repositories.flat();
    if (!this.allRepositories) {
      throw new Error('Missing repository');
    }
    const tasks = await Promise.all(
      this.allRepositories.map((repository) =>
        this.api.getRepoAllIssues(repository.owner.login, repository.name),
      ),
    );
    return tasks.flat();
  }
}
