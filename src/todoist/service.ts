import type {
  IMerjoonService,
  IMerjoonProjects,
  IMerjoonUsers,
  IMerjoonTasks,
} from '../common/types';
import type { TodoistApi } from './api';
import type { ITodoistProject } from './types';
import type { TodoistTransformer } from './transformer';

export class TodoistService implements IMerjoonService {
  constructor(
    public readonly api: TodoistApi,
    public readonly transformer: TodoistTransformer,
  ) {}

  public async init(): Promise<void> {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects: ITodoistProject[] = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    return []; // just return empty until it's implemented
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    return []; // just return empty until it's implemented
  }
}
