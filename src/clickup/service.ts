import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IClickUpMember, IClickUpList, IClickUpTask, ClickUpApiPath } from './types';
import { ClickUpTransformer } from './transformer';
import { ClickUpApi } from './api';

export class ClickUpService implements IMerjoonService {

  constructor(public readonly api: ClickUpApi, public readonly transformer: ClickUpTransformer) {
  }

  protected async getAllRecords<T>(path: ClickUpApiPath) {
    const records: T[] = await this.api.sendGetRequest(path);
    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<IClickUpList>(ClickUpApiPath.Lists);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<IClickUpMember>(ClickUpApiPath.Members);
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllRecords<IClickUpTask>(ClickUpApiPath.Tasks);
    return this.transformer.transformTasks(tasks);
  }
}