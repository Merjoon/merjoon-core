import { IMerjoonCollections, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TeamworkApiPath } from './types';
import { TeamworkApi } from './api';
import { TeamworkTransformer } from './transformer';

export class TeamworkService implements IMerjoonService {

  constructor(public readonly api: TeamworkApi, public readonly transformer: TeamworkTransformer) {
  }

  protected async getOwnPeople() {
    const data = await this.api.sendRequest(TeamworkApiPath.People);
    return data.people;
  }

  protected getOwnProjects() {
    return this.api.sendRequest(TeamworkApiPath.Projects);
  }

  protected getOwnTasks() {
    return this.api.sendRequest(TeamworkApiPath.Tasks);
  }

  public async getCollections(): Promise<IMerjoonCollections> {
    const projects = await this.getOwnProjects();
    return this.transformer.transformProjects(projects)
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getOwnPeople();
    return this.transformer.transformPeople(people)
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getOwnTasks();
    return this.transformer.transformTasks(tasks)
  }

}
