import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IHiveUser, IHiveProject, IHiveAction, HiveApiPath } from './types';
import { HiveTransformer } from './transformer';
import { HiveApi } from './api';

export class HiveService implements IMerjoonService {

  constructor(public readonly api: HiveApi, public readonly transformer: HiveTransformer) {
  }

  protected async getAllRecords<T>(path: HiveApiPath) {
    const records: T[] = await this.api.sendGetRequest(path);
    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<IHiveProject>(HiveApiPath.Projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<IHiveUser>(HiveApiPath.Users);
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllRecords<IHiveAction>(HiveApiPath.Actions);
    tasks.forEach((task) =>  {
      if (task.assignees[0] === 'none') {
        task.assignees = [];
      }
    });
    return this.transformer.transformTasks(tasks);
  }
}
