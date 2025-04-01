import {
  IDataType,
  ITeamworkConfig,
  ITeamworkPeople,
  ITeamworkProject,
  ITeamworkQueryParams,
  ITeamworkTask,
  IObject,
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

  protected async *getAllRecordsIterator<T>(path: string, queryParams?: ITeamworkQueryParams) {
    let shouldStop = false;
    let currentPage = 1;
    const pageSize = this.limit;
    do {
      const data = await this.getRecords(path, {
        ...queryParams,
        page: currentPage,
        pageSize,
      });
      yield (data.items ?? []) as T[];

      shouldStop = !data.meta.page.hasMore;
      currentPage++;
    } while (!shouldStop);
  }

  public async getAllRecords<T>(path: string, queryParams?: ITeamworkQueryParams): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator<T>(path, queryParams);
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
  static processData(data: IDataType) {
    function result(obj: IObject) {
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          obj[key] = value.map(result);
        } else if (typeof value === 'object' && value !== null) {
          if ('type' in value && 'id' in value) {
            if (value.id && value.type) {
              const includedItem = data.included?.[value.type]?.[value.id];
              if (includedItem) {
                obj[key] = result(includedItem);
              }
            }
          }
        }
      }

      return obj;
    }

    const items = data.tasks ?? data.projects ?? data.people;
    return {
      items: items?.map(result),
      meta: data.meta,
    };
  }
}
