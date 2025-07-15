import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { PlaneTransformer } from './transformer';
import { PlaneApi } from './api';
import { IPlaneIssue, IPlaneModel } from './types';

export class PlaneService implements IMerjoonService {
  static mapIds(items: IPlaneModel[]): IPlaneModel[] {
    return items.map((item) => ({
      id: item.id,
    }));
  }
  protected projectIds?: IPlaneModel[];

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
    const users = await this.api.getMembers();
    return this.transformer.transformUsers(users);
  }

  protected async getAllTasks() {
    let issues: IPlaneIssue[] = [];
    if (!this.projectIds || this.projectIds.length === 0) {
      throw new Error('Project IDs are not defined');
    }
    for (const projectId of this.projectIds) {
      const issuesByProject = await this.api.getAllIssues(projectId.id, ['state']);
      issues = issues.concat(issuesByProject);
    }
    return issues;
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
}
