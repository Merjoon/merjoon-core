import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { HeightApi } from './api';
import { HeightTransformer } from './transformer';
import { HeightApiPath } from './types';
export class HeightService implements IMerjoonService {
  constructor(
    public readonly api: HeightApi,
    public readonly transformer: HeightTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const list = await this.api.getRecords(HeightApiPath.Lists);
    return this.transformer.transformLists(list);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const user = await this.api.getRecords(HeightApiPath.Users);
    return this.transformer.transformUsers(user);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.api.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
}
