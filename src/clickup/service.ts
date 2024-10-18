import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IClickUpMember, IClickUpList, IClickUpTask, ClickUpApiPath, IClickUpTaskResponse } from './types';
import { ClickUpTransformer } from './transformer';
import { ClickUpApi } from './api';

export class ClickUpService implements IMerjoonService {

  constructor(public readonly api: ClickUpApi, public readonly transformer: ClickUpTransformer) {
  }

  protected async getAllRecords<T>(path: ClickUpApiPath) {
    const records: T[] = await this.api.sendGetRequest(path);
    return records;
  }

  protected async* getAllTasksIterator(): AsyncGenerator<IClickUpTaskResponse> {
    let lastPage = false;
    let currentPage = 0;
    do {
      try {
        const data: IClickUpTaskResponse = await this.api.sendGetTaskRequest({
          page: currentPage
        });
        yield data;
        lastPage = data.lastPage;
        currentPage++;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!lastPage)
  }

  protected async getAllTasks(): Promise<IClickUpTask[]> {
    const iterator: AsyncGenerator<IClickUpTaskResponse> = this.getAllTasksIterator();
    let records: IClickUpTask[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk.tasks);
    }

    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<IClickUpList>(ClickUpApiPath.Lists);
    return this.transformer.transformLists(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<IClickUpMember>(ClickUpApiPath.Members);
    return this.transformer.transformMembers(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
}