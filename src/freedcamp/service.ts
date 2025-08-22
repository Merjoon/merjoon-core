import {
  IMerjoonMethods,
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { FreedcampApi } from './api';
import { FreedcampTransformer } from './transformer';

export class FreedcampService implements IMerjoonService {
  constructor(
    public readonly api: FreedcampApi,
    public readonly transformer: FreedcampTransformer,
  ) {}
  public async init() {
    return;
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getProjects();
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getUsers();
    return this.transformer.transformUsers(users);
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
