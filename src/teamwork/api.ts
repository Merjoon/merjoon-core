import {
  ITeamworkConfig,
  ITeamworkPeople,
  ITeamworkProject,
  ITeamworkQueryParams,
  ITeamworkResponse,
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
      httpAgent: {
        maxSockets: config.maxSockets,
      },
    };

    super(apiConfig);
    this.limit = config.limit || 250;
  }
  protected async sendGetRequest<T>(path: string, queryParams?: ITeamworkQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }

  protected async *getAllRecordsIterator<T>(path: string, pageSize = this.limit) {
    let shouldStop = false;
    let currentPage = 1;
    do {
      const data = await this.getRecords<ITeamworkResponse<T>>(path, {
        page: currentPage,
        pageSize,
      });

      yield data.projects || data.people || data.tasks;

      shouldStop = !data.meta.page.hasMore;
      currentPage++;
    } while (!shouldStop);
  }

  public async getAllRecords<T>(path: string, pageSize = this.limit) {
    const iterator = this.getAllRecordsIterator<T>(path, pageSize);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords<T>(path: string, params?: ITeamworkQueryParams) {
    return this.sendGetRequest<T>(path, params);
  }
  getAllProjects() {
    return this.getAllRecords<ITeamworkProject>(TEAMWORK_PATHS.PROJECTS);
  }
  getAllPeople() {
    return this.getAllRecords<ITeamworkPeople>(TEAMWORK_PATHS.PEOPLE);
  }
  getAllTasks(projectId: number) {
    const path = TEAMWORK_PATHS.TASKS(projectId);
    return this.getAllRecords<ITeamworkTask>(path);
  }
}
