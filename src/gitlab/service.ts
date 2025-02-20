import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GitLab } from './api';
import { GitLabTransformer } from './transformer';

export class GitLabService implements IMerjoonService {
  groupsIDs?: string[];
  public async init(){
    return;
  }
  constructor(public readonly api: GitLab, public readonly transformer: GitLabTransformer) {
    this.groupsIDs = [];
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects);
  }

  public async getGroups() {
    const groups = await this.api.getAllGroups();
    if(groups?.length > 0){
      this.groupsIDs = groups.map(group => group.id);
    }
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    if (!this.groupsIDs?.length) {
      return [];
    }
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
