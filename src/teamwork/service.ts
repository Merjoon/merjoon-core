import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { ITeamworkPeople, ITeamworkProject, ITeamworkTask, TeamworkApiPath} from './types';
import { TeamworkTransformer } from './transformer';
import { TeamworkApi } from './api';
import {Teamwork_PATHS} from './consts';

export class TeamworkService implements IMerjoonService {
  protected projectIds?: string[];

  constructor(public readonly api: TeamworkApi, public readonly transformer: TeamworkTransformer) {}

  protected async* getAllRecordsIterator<T>(path: TeamworkApiPath, pageSize = 50) {
    let shouldStop = false;
    let currentPage = 1;
    do {
      const data: T[] = await this.api.sendGetRequest(path, {
        page: currentPage,
        pageSize,
      });

      yield data;
      shouldStop = data.length < pageSize;
      currentPage++;
    } while (!shouldStop);
  }
  protected async getAllRecords<T>(path: TeamworkApiPath, pageSize = 50): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator<T>(path, pageSize);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async init(){
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.getAllRecords<ITeamworkProject>(Teamwork_PATHS.PROJECTS);
    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const people = await this.getAllRecords<ITeamworkPeople>(Teamwork_PATHS.USERS);
    const fullName = people.map(person => `${person.firstName} ${person.lastName}`);
    people.forEach((person, index) => {
      person['full-name'] = fullName[index];
    });
    return this.transformer.transformPeople(people);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const projects = await this.getAllRecords<ITeamworkProject>((Teamwork_PATHS.PROJECTS));
    this.projectIds = projects.map(project => project.id);
    const tasksArray = await Promise.all(this.projectIds.map(projectId => this.getAllRecords<ITeamworkTask>(Teamwork_PATHS.TASKS(projectId)  as TeamworkApiPath))
    );
    const allTasks = tasksArray.flat();
    return this.transformer.transformTasks(allTasks);
  }
}