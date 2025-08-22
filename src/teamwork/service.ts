import {
  IMerjoonMethods,
  IMerjoonProjects,
  IMerjoonService,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { ITeamworkItem } from './types';
import { TeamworkTransformer } from './transformer';
import { TeamworkApi } from './api';

export class TeamworkService implements IMerjoonService {
  static mapIds(items: ITeamworkItem[]) {
    return items.map((item) => item.id);
  }

  protected projectIds?: number[];

  constructor(
    public readonly api: TeamworkApi,
    public readonly transformer: TeamworkTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    this.projectIds = TeamworkService.mapIds(projects);
    return this.transformer.transformProjects(projects);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.api.getAllPeople();
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.projectIds) {
      throw new Error('Project IDs are not defined.');
    }

    const tasksArray = await Promise.all(
      this.projectIds.map(async (projectId) => {
        const tasks = await this.api.getAllTasks(projectId);

        return tasks.map((task) => {
          task.projectId = projectId;
          return task;
        });
      }),
    );

    const flattenedTasks = tasksArray.flat();
    return this.transformer.transformTasks(flattenedTasks);
  }

  public call<T extends keyof IMerjoonMethods>(method: T): Promise<IMerjoonMethods[T]> {
    switch (method) {
      case 'getProjects':
        return this.getProjects() as Promise<IMerjoonMethods[T]>;
      case 'getUsers':
        return this.getUsers() as Promise<IMerjoonMethods[T]>;
      case 'getTasks':
        return this.getTasks() as Promise<IMerjoonMethods[T]>;
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }
}
