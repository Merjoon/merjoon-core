import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GithubIssuesApi } from './api';
import { GithubIssuesTransformer } from './transformer';
import { IGithubIssuesMember } from './types';

export class GithubIssuesService implements IMerjoonService {
  static getUniqueMembers(members: IGithubIssuesMember[]) {
    const uniqueMembers = new Map(members.map((member) => [member.id, member]));
    return Array.from(uniqueMembers.values());
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
    const repositories = await this.getAllOrgsRepositories();
    this.repositoriesOwnersNames = repositories.map((repository) => [
      repository.owner.login,
      repository.name,
    ]);
    return this.transformer.transformProjects(repositories);
  }
  protected async getAllOrgsRepositories() {
    if (!this.orgLogins) {
      throw new Error('Missing organization');
    }
    const repositories = await Promise.all(
      this.orgLogins.map((orgLogin) => this.api.getAllReposByOrgLogin(orgLogin)),
    );
    return repositories.flat();
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const members = await this.getAllOrgsMembers();
    return this.transformer.transformUsers(members);
  }
  protected async getAllOrgsMembers() {
    if (!this.orgLogins) {
      throw new Error('Missing organization');
    }
    const members = await Promise.all(
      this.orgLogins.map((orgLogin) => this.api.getAllMembersByOrgLogin(orgLogin)),
    );
    const flattenedMembers = members.flat();
    return GithubIssuesService.getUniqueMembers(flattenedMembers);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.getAllRepositoriesIssues();
    return this.transformer.transformTasks(issues);
  }
  protected async getAllRepositoriesIssues() {
    if (!this.repositoriesOwnersNames) {
      throw new Error('Missing repository fields');
    }
    const issues = await Promise.all(
      this.repositoriesOwnersNames.map((repository) => {
        const [repositoryOwner, repositoryName] = [repository[0], repository[1]];
        return this.api.getRepoAllIssues(repositoryOwner, repositoryName);
      }),
    );
    return issues.flat();
  }
}
