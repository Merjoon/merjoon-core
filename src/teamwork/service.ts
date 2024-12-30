import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { ITeamworkPeople, ITeamworkProject, ITeamworkTask, TeamworkApiPath } from './types';
import { TeamworkTransformer } from './transformer';
import { TeamworkApi } from './api';

export class TeamworkService implements IMerjoonService {
  constructor(public readonly api: TeamworkApi, public readonly transformer: TeamworkTransformer) {}

  protected async* getAllRecordsIterator<T>(path: string, pageSize = 50) {
    let shouldStop = false;
    let currentPage = 1;
    do {
      try {
        const data: T[] = await this.api.sendGetRequest(path, {
          page: currentPage,
          pageSize,
        });

        yield data;
        shouldStop = data.length < pageSize;
        currentPage++;
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!shouldStop);
  }

  protected async getAllRecords<T>(path: string, pageSize = 50) {
    const iterator: AsyncGenerator<any> = this.getAllRecordsIterator<T>(path, pageSize);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public getTaskApiPath(projectId: string): string {
    return TeamworkApiPath.Tasks.replace('{ProjectId}', projectId);
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
    const projects = await this.getAllRecords<ITeamworkProject>(TeamworkApiPath.Projects);
    const ids = projects.map(project => project.id);

    const paths = await Promise.all(ids.map(projectId => this.getTaskApiPath(projectId)));

    const tasks = [];

    for (const path of paths) {
      const task = await this.getAllRecords<ITeamworkTask>(path);
      tasks.push(...task);
    }

    tasks.forEach((task) => {
      task.project = ids.map(id => ({ id }));
      task.assignees = task['responsible-party-ids']?.split(',').map((assignee) => {
        return {
          id: assignee,
        };
      }) ?? [];
    });

    return this.transformer.transformTasks(tasks);
  }
}
