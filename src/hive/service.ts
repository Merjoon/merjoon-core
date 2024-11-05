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

  // protected async* getActionsIterator<IHiveAction>(limit = '50') {
  //   let shouldStop = false;
  //   let currentPage = 1;
  //   do {
  //     try {
  //       const data: IHiveAction[] = await this.api.sendGetRequest(HiveApiPath.Actions, {
  //         limit: limit
  //       });
  //       yield data;
  //       shouldStop = data.length < Number(limit);
  //       currentPage++;
  //       // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  //     } catch (e: any) {
  //       throw new Error(e.message);
  //     }
  //   } while (!shouldStop)
  // }

  // protected async getActions<IHiveAction>(limit = '50'): Promise<IHiveAction[]> {
  //   // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  //   const iterator: AsyncGenerator<any> = this.getActionsIterator(limit);
  //   let records: IHiveAction[] = [];

  //   for await (const nextChunk of iterator) {
  //     records = records.concat(nextChunk);
  //   }

  //   return records;
  // }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<IHiveProject>(HiveApiPath.Projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<IHiveUser>(HiveApiPath.Users);
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    // const tasks: IHiveAction[] = await this.getActions();
    const tasks = await this.getAllRecords<IHiveAction>(HiveApiPath.Actions);
    tasks.forEach((task: IHiveAction) =>  {
      if (task.assignees && task.assignees[0] === 'none') {
        task.assignees = [];
      }
    });
    return this.transformer.transformTasks(tasks);
  }
}
