import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IHivePeople, IHiveProject, IHiveTask, HiveApiPath } from './types';
import { HiveTransformer } from './transformer';
import { HiveApi } from './api';

export class HiveService implements IMerjoonService {

  constructor(public readonly api: HiveApi, public readonly transformer: HiveTransformer) {
  }

  protected async* getAllRecordsIterator<T>(path: HiveApiPath, limit: string = '100') {
    let shouldStop: boolean = false;
    let currentPage: number = 1;
    do {
      try {
        const data: T[] = await this.api.sendGetRequest(path, {
          limit:  limit
        });
        yield data;
        shouldStop = data.length < Number(limit);
        currentPage++;
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!shouldStop)
  }

  protected async getAllRecords<T>(path: HiveApiPath, limit: string = '100') {
    const iterator: AsyncGenerator<any> = this.getAllRecordsIterator<T>(path, limit);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<IHiveProject>(HiveApiPath.Projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<IHivePeople>(HiveApiPath.People);
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllRecords<IHiveTask>(HiveApiPath.Tasks);
    tasks.forEach((task) =>  {
      if (task['assignees'][0] === 'none') {
        task['assignees'] = [];
      }
    });
    return this.transformer.transformTasks(tasks);
  }
}
