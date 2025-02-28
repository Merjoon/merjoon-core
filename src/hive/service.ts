import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IHiveAction, IHiveItem, IHiveProject } from './types';
import { HiveTransformer } from './transformer';
import { HiveApiV1 } from './api/api-v1';
import { HiveApiV2 } from './api/api-v2';

interface IHiveApis {
  v1: HiveApiV1;
  v2: HiveApiV2;
}

export class HiveService implements IMerjoonService {
  protected workspaceIds?: string[];

  constructor(
    public readonly api: IHiveApis,
    public readonly transformer: HiveTransformer,
  ) {}

  protected async fetchAllWorkspaceProjects(): Promise<IHiveProject[]> {
    if (!this.workspaceIds) {
      throw new Error('Missing workspaceIds');
    }

    const projects = await Promise.all(
      this.workspaceIds.map((workspaceId) => this.api.v2.getWorkspaceProjects(workspaceId)),
    );
    return projects.flat();
  }

  protected async fetchAllWorkspaceActions(): Promise<IHiveAction[]> {
    if (!this.workspaceIds) {
      throw new Error('Missing workspaceIds');
    }

    const actions = await Promise.all(
      this.workspaceIds.map((workspaceId) => this.api.v2.getWorkspaceActions(workspaceId)),
    );
    return actions.flat();
  }

  public async init() {
    const workspaces = await this.api.v1.getWorkspaces();
    this.workspaceIds = workspaces.map((workspace: IHiveItem) => workspace.id);
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.fetchAllWorkspaceProjects();
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.v1.getUsers();
    return this.transformer.transformUsers(users);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.fetchAllWorkspaceActions();

    tasks.forEach((task: IHiveAction) => {
      if (task.assignees && task.assignees[0] === 'none') {
        task.assignees = null;
      }
    });

    return this.transformer.transformActions(tasks);
  }
}
