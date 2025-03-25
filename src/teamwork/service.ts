import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TeamworkTransformer } from './transformer';
import { TeamworkApi } from './api';

export class TeamworkService implements IMerjoonService {
  constructor(
    public readonly api: TeamworkApi,
    public readonly transformer: TeamworkTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.api.getAllPeople();
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.api.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
}
