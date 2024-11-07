import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IHiveAction, IHiveItem } from './types';
import { HiveTransformer } from './transformer';
import { HiveApi } from './api';

export class HiveService implements IMerjoonService {
  protected workspaceIds?: string[];
  
  constructor(public readonly api: HiveApi, public readonly transformer: HiveTransformer) {
  }

  protected async getWorkspaceIds() {
    if (!this.workspaceIds) {
      const workspaces = await this.api.getWorkspaces();
      this.workspaceIds = workspaces.map((workspace: IHiveItem) => workspace.id);
    }
    return this.workspaceIds;
  }

  protected async getAllProjects() {
    const workspaceIds = await this.getWorkspaceIds();
    if (!workspaceIds) {
      throw new Error('Missing workspaceIds');
    }
    const items = await Promise.all(workspaceIds.map((id) => this.api.getProjects(id)));
    return items.flat();
  }

  protected async getAllUsers() {
    const workspaceIds = await this.getWorkspaceIds();
    if (!workspaceIds) {
      throw new Error('Missing workspaceIds');
    }
    const items = await Promise.all(workspaceIds.map((id) => this.api.getUsers(id)));
    return items.flat();
  }

  protected async getAllActions() {
    const workspaceIds = await this.getWorkspaceIds();
    if (!workspaceIds) {
      throw new Error('Missing workspaceIds');
    }
    const items = await Promise.all(workspaceIds.map((id) => this.api.getActions(id)));
    return items.flat();
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllProjects();
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllUsers();
    return this.transformer.transformUsers(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllActions();
    tasks.forEach((task: IHiveAction) =>  {
      if (task.assignees && task.assignees[0] === 'none') {
        task.assignees = [];
      }
    });
    return this.transformer.transformActions(tasks);
  }
}
