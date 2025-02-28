import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GitLab } from './api';
import { GitLabTransformer } from './transformer';
import { IGitLabGroup } from './types';
import { GITLAB_PATH } from './consts';

export class GitLabService implements IMerjoonService {
  protected groupsIds?: string[];
  constructor(
    public readonly api: GitLab,
    public readonly transformer: GitLabTransformer,
  ) {}
  public async init() {
    return;
  }
  static mapGroupIds(item: IGitLabGroup[]) {
    return item.map((item: IGitLabGroup) => item.id);
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getRecords(GITLAB_PATH.PROJECTS, { owned: true });
    return this.transformer.transformProjects(projects);
  }
  private async getGroupIds(): Promise<string[]> {
    const groups = await this.api.getRecords(GITLAB_PATH.GROUPS);
    this.groupsIds = GitLabService.mapGroupIds(groups);
    return this.groupsIds;
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    await this.getGroupIds();
    if (!this.groupsIds) {
      throw new Error('id is not set in the variables');
    }
    const members = await Promise.all(
      this.groupsIds.map((groupId) => this.api.getRecords(GITLAB_PATH.MEMBERS(groupId))),
    );
    const users = members.flat();
    return this.transformer.transformUsers(users);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.api.getRecords(GITLAB_PATH.ISSUES);
    return this.transformer.transformIssues(issues);
  }
}
