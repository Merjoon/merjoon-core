import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { ITeamworkItem } from './types';
import { TeamworkTransformer } from './transformer';
import { TeamworkApi } from './api';

export class TeamworkService implements IMerjoonService {
  protected projectIds?: number[];

  static mapIds(items: ITeamworkItem[]) {
    return items.map((item: ITeamworkItem) => item.id);
  }

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
  // TODO change it like name: 'JOIN_STRINGS("firstName","lastName", " ")
  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.api.getAllUsers();
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
        const tasks = await this.api.getAllIssues(projectId);

        return tasks.map((task) => {
          task.projectId = projectId;
          return task;
        });
      }),
    );

    const flattenedTasks = tasksArray.flat();
    return this.transformer.transformTasks(flattenedTasks);
  }
}
