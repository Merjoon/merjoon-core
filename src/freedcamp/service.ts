import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
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

  protected async getAllTasks() {
    return this.api.getAllTasks();
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllTasks();
    for (const task of tasks) {
      if (task.assigned_ids.length === 1 && task.assigned_ids[0] === '0') {
        task.assigned_ids = [];
      }
    }
    return this.transformer.transformTasks(tasks);
  }
}
