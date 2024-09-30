import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IClickUpPeople, IClickUpProject, IClickUpTask, ClickUpApiPath } from './types';
import { ClickUpTransformer } from './transformer';
import { HiveApi } from './api';

export class HiveService implements IMerjoonService {

  constructor(public readonly api: HiveApi, public readonly transformer: ClickUpTransformer) {
  }

  protected async getAllRecords<T>(path: ClickUpApiPath) {
    let records: T[] = await this.api.sendGetRequest(path);
    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<IClickUpProject>(ClickUpApiPath.Projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<IClickUpPeople>(ClickUpApiPath.People);
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllRecords<IClickUpTask>(ClickUpApiPath.Tasks);
    // tasks.forEach((task) =>  {
    //   if (task['assignees'][0] === 'none') {
    //     task['assignees'] = [];
    //   }
    // });
    return this.transformer.transformTasks(tasks);
  }
}