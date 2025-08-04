import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { FreedcampApi } from './api';
import { FreedcampTransformer } from './transformer';
import { IFreedcampTask } from './types';

export class FreedcampService implements IMerjoonService {
  static checkAssignees(task: IFreedcampTask) {
    if (task.assigned_ids[0] === '0') {
      task.assigned_ids = [];
    }
  }
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
    for (const task of tasks) {
      FreedcampService.checkAssignees(task);
    }
    return this.transformer.transformTasks(tasks);
  }
}
