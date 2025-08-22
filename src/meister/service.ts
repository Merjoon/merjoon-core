import {
  IMerjoonMethods,
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { MeisterApi } from './api';
import { MeisterTransformer } from './transformer';

export class MeisterService implements IMerjoonService {
  constructor(
    public readonly api: MeisterApi,
    public readonly transformer: MeisterTransformer,
  ) {}
  public async init() {
    return;
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.api.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const persons = await this.api.getPersons();
    return this.transformer.transformPersons(persons);
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
