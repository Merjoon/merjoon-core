import { IMerjoonProjects, IMerjoonServiceBase, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { PlaneTransformer } from './transformer';
import { PlaneApi } from './api';
import { IPlaneIssue, IPlaneItem } from './types';

export class PlaneService implements IMerjoonServiceBase {
  static mapIds(items: IPlaneItem[]) {
    return items.map((item: IPlaneItem) => item.id);
  }
  protected projectIds?: string[];

  constructor(
    public readonly api: PlaneApi,
    public readonly transformer: PlaneTransformer,
  ) {}
  public async init() {
    return;
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getProjects();
    this.projectIds = PlaneService.mapIds(projects);
    return this.transformer.transformProjects(projects);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const members = await this.api.getMembers();
    return this.transformer.transformUsers(members);
  }

  protected async getAllIssues() {
    let issues: IPlaneIssue[] = [];
    if (!this.projectIds) {
      throw new Error('ProjectIds are not defined');
    }
    for (const projectId of this.projectIds) {
      const issuesByProject = await this.api.getAllIssues(projectId, ['state']);
      issues = issues.concat(issuesByProject);
    }
    return issues;
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const issues = await this.getAllIssues();
    return this.transformer.transformTasks(issues);
  }
}
