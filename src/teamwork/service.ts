import { IMerjoonCollections, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TeamworkTransformer } from './transformer';
import { TeamworkApiPath } from './types';
import { TeamworkApi } from './api';

export class TeamworkService implements IMerjoonService {

  constructor(public readonly api: TeamworkApi, public readonly transformer: TeamworkTransformer) {
  }

  protected async* getPeopleDataFromApi(pageSize: number = 50) {
    let shouldStop: boolean = false;
    let currentPage: number = 1;

    do {
      try {
        const response = await this.api.sendRequest(TeamworkApiPath.People, { page: currentPage, pageSize });
        yield  response['people'];
        shouldStop = response['people'].length < pageSize;
        currentPage++;
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!shouldStop)
  }

  protected async getAllPeople(pageSize: number = 50){
    const iterator: AsyncGenerator<any> =  this.getPeopleDataFromApi(pageSize);
    let people: any[] = [];

    for await (const nextItem of iterator) {
      people = people.concat(nextItem);
    }

    return people;
  }

  protected async* getProjectsDataFromApi(pageSize: number = 50) {
    let shouldStop: boolean = false;
    let currentPage: number = 1;

    do {
      try {
        const response = await this.api.sendRequest(TeamworkApiPath.Projects);
        yield  response['projects'];
        shouldStop = response['projects'].length < pageSize;
        currentPage++;
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!shouldStop)
  }

  protected async getAllProjects(pageSize: number = 50){
    const iterator: AsyncGenerator<any> =  this.getProjectsDataFromApi(pageSize);
    let projects: any[] = [];

    for await (const nextItem of iterator) {
      projects = projects.concat(nextItem);
    }

    return projects;
  }

  protected async* getTasksDataFromApi(pageSize: number = 50) {
    let shouldStop: boolean = false;
    let currentPage: number = 1;

    do {
      try {
        const response = await this.api.sendRequest(TeamworkApiPath.Tasks);
        yield  response['todo-items'];
        shouldStop = response['todo-items'].length < pageSize;
        currentPage++;
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!shouldStop)
  }

  protected async getAllTasks(pageSize: number = 50){
    const iterator: AsyncGenerator<any> =  this.getTasksDataFromApi(pageSize);
    let tasks: any[] = [];

    for await (const nextItem of iterator) {
      tasks = tasks.concat(nextItem);
    }

    return tasks;
  }

  protected async getOwnPeople() {
    return await this.getAllPeople();
  }

  protected async getOwnProjects() {
    return await this.getAllProjects();
  }

  protected async getOwnTasks() {
    return await this.getAllTasks();
  }

  public async getCollections(): Promise<IMerjoonCollections> {
    const projects = await this.getOwnProjects();
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getOwnPeople();
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const tasks = await this.getOwnTasks();
    return this.transformer.transformTasks(tasks);
  }
}
