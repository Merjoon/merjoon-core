import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { WrikeTransformer } from './transformer';
import { WrikeApi } from './api';
import { IWrikeUser } from './types';

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

    users.data.forEach((user: IWrikeUser) => {
      user.fullName = `${user?.firstName} ${user?.lastName}`;
    });
    return this.transformer.transformUsers(users.data);
  }

  public async getAllTasks() {
    return this.api.getAllTasks();
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
}
