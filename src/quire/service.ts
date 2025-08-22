import {
  IMerjoonMethods,
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { QuireApi } from './api';
import { QuireTransformer } from './transformer';
import { IQuireItem } from './types';

export class QuireService implements IMerjoonService {
  static mapIds(items: IQuireItem[]) {
    return items.map((item: IQuireItem) => item.id);
  }
  protected projectIds?: string[];
  constructor(
    public readonly api: QuireApi,
    public readonly transformer: QuireTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getProjects();
    this.projectIds = QuireService.mapIds(projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getUsers();
    return this.transformer.transformUsers(users);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.projectIds) {
      throw new Error('No projectIds provided.');
    }
    const tasksArray = await Promise.all(
      this.projectIds.map(async (projectId) => {
        const tasks = await this.api.getTasks(projectId);
        return tasks.map((task) => {
          task.projectId = projectId;
          return task;
        });
      }),
    );
    const allTasks = tasksArray.flat();
    return this.transformer.transformTasks(allTasks);
  }

  public call<T extends keyof IMerjoonMethods>(method: T): Promise<IMerjoonMethods[T]> {
    switch (method) {
      case 'getProjects':
        return this.getProjects() as Promise<IMerjoonMethods[T]>;
      case 'getUsers':
        return this.getUsers() as Promise<IMerjoonMethods[T]>;
      case 'getTasks':
        return this.getTasks() as Promise<IMerjoonMethods[T]>;
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }
}
