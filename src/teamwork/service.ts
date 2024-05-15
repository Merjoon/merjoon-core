import {IMerjoonCollections, IMerjoonService, IMerjoonTasks, IMerjoonUsers} from '../common/types';
import {IQueryParams, TeamworkApiPath} from './types';
import {TeamworkTransformer} from './transformer';
import {TeamworkApi} from './api';

export class TeamworkService implements IMerjoonService {

  constructor(public readonly api: TeamworkApi, public readonly transformer: TeamworkTransformer) {
  }

  public async* getDataFromApi(teamworkKey: string, responseKey: string, {page = 1, pageSize = 50}: Partial<IQueryParams> = {}) {
    let shouldStop: boolean = false;

    do {
      try {
        const data = await this.api.sendRequest(TeamworkApiPath[teamworkKey as keyof typeof TeamworkApiPath], {page, pageSize});
        yield data[responseKey]
        shouldStop = data[responseKey].length < pageSize;
        page++;
      } catch (e: any) {
        console.error(e.message);
      }
    } while (!shouldStop)
  }

  private async getDataFromGenerator(teamworkKey: string, responseKey: string, {page = 1, pageSize = 50}: Partial<IQueryParams> = {}){
    const data: AsyncGenerator<any> =  this.getDataFromApi(teamworkKey, responseKey, {page, pageSize});
    let result: any[] = [];

    for await (const nextItem of data) {
      result = [...result, ...nextItem];
    }

    return result;
  }

  private async getAllData(teamworkKey: string, responseKey: string){
    const data = await this.api.sendRequest(TeamworkApiPath[teamworkKey as keyof typeof TeamworkApiPath]);
    return data[responseKey];
  }

  protected async getOwnPeople() {
    return await this.getDataFromGenerator('People', 'people', {page: 1, pageSize: 1});
  }

  protected async getOwnProjects() {
    return await this.getDataFromGenerator('Projects', 'projects', {page: 1, pageSize: 5});
  }

  protected async getOwnTasks() {
    return await this.getDataFromGenerator('Tasks', 'todo-items', {page: 1, pageSize: 10});
  }

  public async getCollections(): Promise<IMerjoonCollections> {
    const projects = await this.getOwnProjects();
    return this.transformer.transformProjects(projects);
  }

  public async getAllCollections(): Promise<IMerjoonCollections> {
    const projects = await this.getAllData('Projects', 'projects');
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getOwnPeople();
    return this.transformer.transformPeople(people);
  }

  public async getAllUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllData('People', 'people');
    return this.transformer.transformProjects(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getOwnTasks();
    return this.transformer.transformTasks(tasks);
  }

  public async getAllTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getAllData('Tasks', 'todo-items');
    return this.transformer.transformProjects(tasks);
  }
}
