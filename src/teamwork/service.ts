import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { ITeamworkPeople, ITeamworkProject, ITeamworkTask, TeamworkApiPath } from './types';
import { TeamworkTransformer } from './transformer';
import { TeamworkApi } from './api';

export class TeamworkService implements IMerjoonService {

  constructor(public readonly api: TeamworkApi, public readonly transformer: TeamworkTransformer) {
  }

  protected async* getAllRecordsIterator<T>(path: TeamworkApiPath, pageSize: number = 50) {
    let shouldStop: boolean = false;
    let currentPage: number = 1;
    do {
      try {
        const data: T[] = await this.api.sendGetRequest(path, {
          page: currentPage, pageSize
        });
        yield data;
        shouldStop = data.length < pageSize;
        currentPage++;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!shouldStop)
  }

  protected async getAllRecords<T>(path: TeamworkApiPath, pageSize: number = 50) {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const iterator: AsyncGenerator<any> = this.getAllRecordsIterator<T>(path, pageSize);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<ITeamworkProject>(TeamworkApiPath.Projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<ITeamworkPeople>(TeamworkApiPath.People);
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllRecords<ITeamworkTask>(TeamworkApiPath.Tasks);
    tasks.forEach((task) => {
      task.assignees = task["responsible-party-ids"]?.split(',').map((assignee) => {
        return {
          id: assignee,
        };
      })
    });
    return this.transformer.transformTasks(tasks);
  }
}
