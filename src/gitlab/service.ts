import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GitLab } from './api';
import { GitLabTransformer } from './transformer';
import {IGitLabGroup} from './types';

export class GitLabService implements IMerjoonService {
  protected groupsIDs?: string[];
  constructor(public readonly api: GitLab, public readonly transformer: GitLabTransformer) {
  }
  public async init(){
    return;
  }
  static mapIds(item:IGitLabGroup[]){
    return item.map((item:IGitLabGroup) => item.id);
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const groups = await this.api.getAllGroups();
    this.groupsIDs = GitLabService.mapIds(groups);
    const members = await Promise.all(
      this.groupsIDs.map(groupId => this.api.getAllMembersByGroupId(groupId))
    );
    const users = members.flat();
    return this.transformer.transformUsers(users);
  };
  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.api.getAllIssues();
    return this.transformer.transformIssues(issues);
  }
}
