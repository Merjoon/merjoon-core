import {
  IMerjoonProjects,
  IMerjoonServiceBase,
  IMerjoonTasks,
  IMerjoonUsers,
} from '../common/types';
import { MeisterApi } from './api';
import { MeisterTransformer } from './transformer';

export class MeisterService implements IMerjoonServiceBase {
  constructor(
    public readonly api: MeisterApi,
    public readonly transformer: MeisterTransformer,
  ) {}
  public async init() {
    return;
  }
  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getAllProjects();
    return this.transformer.transformProjects(projects);
  }
  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.api.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
  public async getUsers(): Promise<IMerjoonUsers> {
    const persons = await this.api.getPersons();
    return this.transformer.transformPersons(persons);
  }
}
