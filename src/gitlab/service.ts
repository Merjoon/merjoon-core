import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { GitLab } from './api';
import { GitLabTransformer } from './transformer';
import {IGitLabGroup} from './types';
import {GITLAB_PATH} from './consts';

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
    // const projects = await this.api.getAllProjects();
    const projects = await  this.api.getRecords(GITLAB_PATH.PROJECTS,{owned:true});
    return this.transformer.transformProjects(projects);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const groups = await this.api.getAllGroups();
    this.groupsIDs = GitLabService.mapIds(groups);
    const members = await Promise.all(
      this.groupsIDs.map(groupId => this.api.getRecords(GITLAB_PATH.MEMBERS(groupId)))
    );
    const users = members.flat();
    return this.transformer.transformUsers(users);
  };
  public async getTasks(): Promise<IMerjoonTasks> {
    // const issues = await this.api.getAllIssues();
    const issues = await this.api.getRecords(GITLAB_PATH.ISSUES);
    return this.transformer.transformIssues(issues);
  }
}
