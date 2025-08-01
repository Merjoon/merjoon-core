import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { QuireApi } from './api';
import { QuireTransformer } from './transformer';

export class QuireService implements IMerjoonService {
  protected projectIds?: string[];
  constructor(
    public readonly api: QuireApi,
    public readonly transformer: QuireTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getProjects();
    this.projectIds = projects.map((project) => project.id);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getUsers();
    return this.transformer.transformUsers(users);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.projectIds) {
      throw new Error('No projectIds provided.');
    }
    const tasksArray = await Promise.all(
      this.projectIds.map(async (projectId) => {
        const tasks = await this.api.getTasks(projectId);
        return tasks.map((task) => {
          task.projectId = projectId;
          return task;
        });
      }),
    );
    const allTasks = tasksArray.flat();
    return this.transformer.transformTasks(allTasks);
  }
}
