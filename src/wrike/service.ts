import {
  IMerjoonMethods,
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { WrikeTransformer } from './transformer';
import { WrikeApi } from './api';

export class WrikeService implements IMerjoonService {
  constructor(
    public readonly api: WrikeApi,
    public readonly transformer: WrikeTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects.data);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getAllUsers();
    return this.transformer.transformUsers(users.data);
  }

  protected async getAllTasks() {
    return this.api.getAllTasks();
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllTasks();
    return this.transformer.transformTasks(tasks);
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
