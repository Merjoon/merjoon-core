import * as https from 'https';
import {
  ITeamworkConfig,
  ITeamworkInclude,
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

    if (config.httpsAgent) {
      const agent = new https.Agent({
        keepAlive: true,
        maxSockets: config.httpsAgent.maxSockets,
      });
      apiConfig.httpsAgent = agent;
    }

    super(apiConfig);
    this.limit = config.limit || 250;
  }

  async sendGetRequest(path: string, queryParams?: ITeamworkQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }

  protected async *getAllRecordsIterator(path: string, queryParams: ITeamworkQueryParams) {
    let shouldStop = false;
    let currentPage = 1;

    do {
      const data = await this.getRecords(path, {
        ...queryParams,
        page: currentPage,
      });
      console.log(data);
      yield data.projects || data.people || data.tasks || data.included;
      console.log(data.included);

      shouldStop = !data.meta.page.hasMore;
      currentPage++;
    } while (!shouldStop);
  }

  public async getAllRecords<T>(path: string, queryParams: ITeamworkQueryParams): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator(path, queryParams);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords(path: string, params?: ITeamworkQueryParams) {
    return this.sendGetRequest(path, params);
  }

  getAllProjects(): Promise<ITeamworkProject[]> {
    const queryParams: ITeamworkQueryParams = {
      page: 1,
      pageSize: this.limit,
    };
    return this.getAllRecords(TEAMWORK_PATHS.PROJECTS, queryParams);
  }

  getAllPeople(): Promise<ITeamworkPeople[]> {
    const queryParams: ITeamworkQueryParams = {
      page: 1,
      pageSize: this.limit,
    };
    return this.getAllRecords(TEAMWORK_PATHS.PEOPLE, queryParams);
  }

  getAllTasks(projectId: number): Promise<ITeamworkTask[]> {
    const queryParams: ITeamworkQueryParams = {
      page: 1,
      pageSize: this.limit,
    };
    return this.getAllRecords<ITeamworkTask>(TEAMWORK_PATHS.TASKS(projectId), queryParams);
  }

  getAllIncludes(projectId: number): Promise<ITeamworkInclude[]> {
    const queryParams: ITeamworkQueryParams = {
      page: 1,
      pageSize: this.limit,
      include: 'cards.columns',
    };
    return this.getAllRecords<ITeamworkInclude>(TEAMWORK_PATHS.TASKS(projectId), queryParams);
  }
}
