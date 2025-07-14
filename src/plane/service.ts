import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { PlaneTransformer } from './transformer';
import { PlaneApi } from './api';
import { IPlaneIssue } from './types';

export class PlaneService implements IMerjoonService {
  constructor(
    public readonly api: PlaneApi,
    public readonly transformer: PlaneTransformer,
  ) {}

  public async init() {
    return;
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getProjects();
    return this.transformer.transformProjects(projects);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getMembers();
    return this.transformer.transformUsers(users);
  }

  protected async getAllTasks() {
    const projects = await this.api.getProjects();
    let issues: IPlaneIssue[] = [];
    for (const project of projects) {
      const projectID = project.id;
      const issuesByProject = await this.api.getAllIssues(projectID, ['state']);
      issues = issues.concat(issuesByProject);
    }
    return issues;
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
}
