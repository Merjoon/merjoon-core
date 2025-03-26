import {
  ITeamworkConfig,
  ITeamworkPeople,
  ITeamworkProject,
  ITeamworkQueryParams,
  ITeamworkTask,
} from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { TEAMWORK_PATHS } from './consts';

export class TeamworkApi extends HttpClient {
  public readonly limit: number;
  constructor(protected config: ITeamworkConfig) {
    const basePath = `https://${config.subdomain}.teamwork.com/projects/api/v3/`;

    const encodedCredentials = Buffer.from(`${config.token}:${config.password}`).toString('base64');

    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    };

    super(apiConfig);
    this.limit = config.limit || 250;
  }

  protected async sendGetRequest(path: string, queryParams?: ITeamworkQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }

  protected async *getAllRecordsIterator(path: string, queryParams?: ITeamworkQueryParams) {
    let shouldStop = false;
    let currentPage = 1;
    const pageSize = this.limit;
    do {
      const data = await this.getRecords(path, {
        ...queryParams,
        page: currentPage,
        pageSize,
      });
      yield data.items;

      shouldStop = !data.meta.page.hasMore;
      currentPage++;
    } while (!shouldStop);
  }

  public async getAllRecords<T>(path: string, queryParams?: ITeamworkQueryParams): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator(path, queryParams);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords(path: string, params?: ITeamworkQueryParams) {
    const data = await this.sendGetRequest(path, params);
    return TeamworkApi.processData(data);
  }

  getAllProjects(): Promise<ITeamworkProject[]> {
    return this.getAllRecords(TEAMWORK_PATHS.PROJECTS);
  }

  getAllPeople(): Promise<ITeamworkPeople[]> {
    return this.getAllRecords(TEAMWORK_PATHS.PEOPLE);
  }

  getAllTasks(): Promise<ITeamworkTask[]> {
    return this.getAllRecords(TEAMWORK_PATHS.TASKS, {
      include: 'cards.columns',
    });
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  static processData(data: any) {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    let status: any;
    const mySet = new Set();
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    function result(obj: any) {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const item = obj[key];
          if (item.id && item.type) {
            if (mySet.has(item.type)) {
              return obj;
            }
            mySet.add(item.type);
            if (data.included[item.type]?.[item.id]) {
              status = data.included[item.type][item.id];
              result(data.included[item.type][item.id]);
              obj[key] = status;
            }
          }
        }
      }
      return obj;
    }
    if (data.tasks && Array.isArray(data.tasks)) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      data.tasks.forEach((task: any) => result(task));
    }
    // Process projects if they exist
    if (data.projects && Array.isArray(data.projects)) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      data.projects.forEach((project: any) => result(project));
    }

    // Process people if they exist
    if (data.people && Array.isArray(data.people)) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      data.people.forEach((person: any) => result(person));
    }
    return {
      items: data.projects || data.tasks || data.people,
      meta: data.meta,
    };
  }
}
