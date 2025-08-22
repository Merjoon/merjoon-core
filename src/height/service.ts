import {
  IMerjoonMethods,
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { HeightApi } from './api';
import { HeightTransformer } from './transformer';
export class HeightService implements IMerjoonService {
  constructor(
    public readonly api: HeightApi,
    public readonly transformer: HeightTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const list = await this.api.getProjects();
    return this.transformer.transformLists(list);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const user = await this.api.getUsers();
    return this.transformer.transformUsers(user);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.api.getAllTasks();
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
