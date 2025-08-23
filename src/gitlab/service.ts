import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GitLabApi } from './api';
import { GitLabTransformer } from './transformer';
import { IGitLabGroup, IGitLabIssue, IGitLabMember, IGitLabProject } from './types';
import { GITLAB_PATH } from './consts';

export class GitLabService implements IMerjoonService {
  static mapGroupIds(item: IGitLabGroup[]) {
    return item.map((item: IGitLabGroup) => item.id);
  }
  protected groupsIds?: string[];
  constructor(
    public readonly api: GitLabApi,
    public readonly transformer: GitLabTransformer,
  ) {}
  public async init() {
    return;
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getRecords<IGitLabProject[]>(GITLAB_PATH.PROJECTS, {
      owned: true,
    });
    return this.transformer.transformProjects(projects.data);
  }
  private async getGroupIds() {
    const groups = await this.api.getRecords<IGitLabGroup[]>(GITLAB_PATH.GROUPS);
    this.groupsIds = GitLabService.mapGroupIds(groups.data);
    return this.groupsIds;
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    await this.getGroupIds();
    if (!this.groupsIds) {
      throw new Error('id is not set in the variables');
    }
    const members = await Promise.all(
      this.groupsIds.map((groupId) =>
        this.api.getRecords<IGitLabMember>(GITLAB_PATH.MEMBERS(groupId)),
      ),
    );
    const users = members.flatMap((response) => response.data);
    return this.transformer.transformUsers(users);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.api.getRecords<IGitLabIssue[]>(GITLAB_PATH.ISSUES);
    return this.transformer.transformIssues(issues.data);
  }
}
