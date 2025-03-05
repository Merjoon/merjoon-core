import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import {
  ITeamworkItem,
  ITeamworkPeople,
  ITeamworkProject,
  ITeamworkTask,
  TeamworkApiPath,
} from './types';
import { TeamworkTransformer } from './transformer';
import { TeamworkApi } from './api';
import { TEAMWORK_PATHS } from './consts';

export class TeamworkService implements IMerjoonService {
  protected projectIds?: number[];

  static mapIds(items: ITeamworkItem[]) {
    return items.map((item: ITeamworkItem) => item.id);
  }

  constructor(
    public readonly api: TeamworkApi,
    public readonly transformer: TeamworkTransformer,
  ) {}

  protected async *getAllRecordsIterator(path: TeamworkApiPath, pageSize = 50) {
    let shouldStop = false;
    let currentPage = 1;
    do {
      const data = await this.api.sendGetRequest(path, {
        page: currentPage,
        pageSize,
      });
      console.log(path);

      yield data.projects || data.people || data.tasks;

      shouldStop = !data.meta.page.hasMore;
      currentPage++;
    } while (!shouldStop);
  }
  protected async getAllRecords<T>(path: TeamworkApiPath, pageSize = 50): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator(path, pageSize);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<ITeamworkProject>(TEAMWORK_PATHS.PROJECTS);
    this.projectIds = TeamworkService.mapIds(projects);
    return this.transformer.transformProjects(projects);
  }
  // TODO change it like name: 'JOIN_STRINGS("firstName","lastName", " ")
  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<ITeamworkPeople>(TEAMWORK_PATHS.USERS);
    people.map((person) => {
      person.fullName = `${person.firstName}${person.lastName}`;
    });
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.projectIds) {
      throw new Error('Project IDs are not defined.');
    }

    const tasksArray = await Promise.all(
      this.projectIds.map(async (projectId) => {
        const include = 'cards.columns';
        const path = TEAMWORK_PATHS.TASKS(projectId, include);
        const tasks = await this.getAllRecords<ITeamworkTask>(path as TeamworkApiPath);
        return tasks.map((task) => {
          task.projectId = projectId;
          if (task.included) {
            task.included = task.included.map((card) => {
              if (card.column) {
                const column = card.column.id;
                if (column == card.columns?.id) {
                  task.columnName = card.columns?.name;
                }
              }
              return card;
            });
          }
          return task;
        });
      }),
    );

    const flattenedTasks = tasksArray.flat();
    return this.transformer.transformTasks(flattenedTasks);
  }
}
