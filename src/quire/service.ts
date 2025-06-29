import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { QuireApi } from './api';
import { QuireTransformer } from './transformer';
import { IQuireModel } from './types';

export class QuireService implements IMerjoonService {
  static mapIds(items: IQuireModel[]): IQuireModel[] {
    return items.map((item) => ({
      oid: item.oid,
      id: item.id,
    }));
  }

  protected projectIds?: IQuireModel[];
  constructor(
    public readonly api: QuireApi,
    public readonly transformer: QuireTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getProjects();
    this.projectIds = QuireService.mapIds(projects);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getUsers();
    return this.transformer.transformUsers(users);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.projectIds || this.projectIds.length === 0) {
      throw new Error('No project IDs provided.');
    }
    const tasksArray = await Promise.all(
      this.projectIds.map(async ({ oid, id }) => {
        const tasks = await this.api.getTasks(oid);
        return tasks.map((task) => {
          task.projectId = id;
          return task;
        });
      }),
    );
    const allTasks = tasksArray.flat();
    return this.transformer.transformTasks(allTasks);
  }
}
