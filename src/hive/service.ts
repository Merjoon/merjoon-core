import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IHiveAction, IHiveItem, IHiveUser, IHiveProject } from './types';
import { HiveTransformer } from './transformer';
import { HiveApiV1 } from './api/api-v1';
import { HiveApiV2 } from './api/api-v2';

export class HiveService implements IMerjoonService {
  protected workspaceIds?: string[];
  
  constructor(
    public readonly api: {v1: HiveApiV1, v2: HiveApiV2}, 
    public readonly transformer: HiveTransformer
  ) {}

  protected async getWorkspaceIds(): Promise<string[] | undefined> {
    if (!this.workspaceIds) {
      const workspaces = await this.api.v1.getWorkspaces();
      this.workspaceIds = workspaces.map((workspace: IHiveItem) => workspace.id);
    }
    return this.workspaceIds;
  }

  protected async fetchAllFromWorkspaces<T>(
    fetchFunction: (workspaceId: string) => Promise<T[]>
  ): Promise<T[]> {
    const workspaceIds = await this.getWorkspaceIds();
    if (!workspaceIds) throw new Error('Missing workspaceIds');
    
    const items = await Promise.all(workspaceIds.map(fetchFunction));
    return items.flat();
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.fetchAllFromWorkspaces<IHiveProject>((id) => this.api.v2.getProjects(id));
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.fetchAllFromWorkspaces<IHiveUser>((id) => this.api.v1.getUsers(id));
    return this.transformer.transformUsers(users);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.fetchAllFromWorkspaces<IHiveAction>((id) => this.api.v2.getActions(id));
    
    tasks.forEach((task: IHiveAction) => {
      if (task.assignees && task.assignees[0] === 'none') {
        task.assignees = null;
      }
    });
    
    return this.transformer.transformActions(tasks);
  }
}
