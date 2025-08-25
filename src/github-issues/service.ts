import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GithubIssuesApi } from './api';
import { GithubIssuesTransformer } from './transformer';
import { IGithubIssuesMember } from './types';

export class GithubIssuesService implements IMerjoonService {
  static toMakeUsersUnique(users: IGithubIssuesMember[]) {
    return [...new Map(users.map((user) => [user.id, user])).values()];
  }
  protected orgLogins?: string[];
  protected repositoriesOwnersNames?: string[][];

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
    this.repositoriesOwnersNames = projects.map((project) => [project.owner.login, project.name]);
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
    const flattenedUsers = users.flat();
    return GithubIssuesService.toMakeUsersUnique(flattenedUsers);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllRepositoriesTasks();
    return this.transformer.transformTasks(tasks);
  }
  protected async getAllRepositoriesTasks() {
    if (!this.repositoriesOwnersNames) {
      throw new Error('Missing repository fields');
    }
    const tasks = await Promise.all(
      this.repositoriesOwnersNames.map((repository) =>
        this.api.getRepoAllIssues(repository[0], repository[1]),
      ),
    );
    return tasks.flat();
  }
}
