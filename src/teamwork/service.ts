import {IMerjoonComments, IMerjoonProjects, IMerjoonServiceBase, IMerjoonTasks, IMerjoonUsers} from '../common/types';
import {ITeamworkItem} from './types';
import {TeamworkTransformer} from './transformer';
import {TeamworkApi} from './api';

export class TeamworkService implements IMerjoonServiceBase {
  static mapIds(items: ITeamworkItem[]) {
    return items.map((item) => item.id);
  }

  protected projectIds?: number[];
  protected taskIds?: number[];

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
    this.taskIds = [];
    const tasksArray = await Promise.all(
      this.projectIds.map(async (projectId) => {
        const tasks = await this.api.getAllTasks(projectId);

        return tasks.map((task) => {
          this.taskIds?.push(task.id);
          task.projectId = projectId;
          return task;
        });
      }),
    );

    const flattenedTasks = tasksArray.flat();
    return this.transformer.transformTasks(flattenedTasks);
  }

  public async getComments(): Promise<IMerjoonComments> {
    if (!this.taskIds) {
      throw new Error('Task IDs are not defined.');
    }

    const commentsArray = await Promise.all(
      this.taskIds.map(async (taskId) => {
        const comments = await this.api.getAllComments(taskId);
        return comments.map((comment) => {
          return comment;
        });
      }),
    );
    const flattenedComments = commentsArray.flat();
    return this.transformer.transformComments(flattenedComments);
  }
}
