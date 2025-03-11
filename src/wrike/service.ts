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

    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getAllUsers();
    users.forEach((user: IWrikeUser) => {
      user.fullName = `${user?.firstName} ${user?.lastName}`;
    });
    return this.transformer.transformUsers(users);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.api.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
}
