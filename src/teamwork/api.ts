import {
  ITeamworkConfig,
  ITeamworkQueryParams,
  ITeamworkValue,
  ITeamworkItem,
  ITeamworkResponse,
  ITeamworkProject,
  ITeamworkPeople,
  ITeamworkTask,
  ITeamworkEntity,
  ITeamworkEntityArrayItem,
} from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { TEAMWORK_PATHS } from './consts';

export class TeamworkApi extends HttpClient {
  static isTeamworkItem(v: ITeamworkEntityArrayItem): v is ITeamworkItem {
    return !!(typeof v === 'object' && v !== null && 'type' in v && v.id);
  }
  static transformResponse(response: ITeamworkResponse) {
    function result(entity: ITeamworkEntity) {
      for (const entry of Object.entries(entity)) {
        const key = entry[0] as keyof ITeamworkEntity;
        const value = entry[1] as ITeamworkValue;
        if (Array.isArray(value)) {
          Object.assign(entity, {
            [key]: value.map((v: ITeamworkEntityArrayItem) => {
              if (TeamworkApi.isTeamworkItem(v)) {
                if (response.included) {
                  const includedItem = response.included[v.type]?.[v.id];
                  if (includedItem) {
                    return result(includedItem);
                  }
                }
              }
              return v;
            }),
          });
        } else if (typeof value === 'object' && value !== null) {
          if (value.id && value.type) {
            if (response.included) {
              const includedItem = response.included[value.type]?.[value.id];
              if (includedItem) {
                Object.assign(entity, {
                  [key]: result(includedItem),
                });
              }
            }
          }
        }
      }
      return entity;
    }
    const items = response.tasks ?? response.projects ?? response.people ?? [];
    return {
      items: items.map(result),
      meta: response.meta,
    };
  }
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

  protected async *getAllRecordsIterator(path: string, queryParams?: ITeamworkQueryParams) {
    let shouldStop = false;
    let currentPage = 1;
    do {
      const data = await this.getRecords(path, {
        ...queryParams,
        page: currentPage,
        pageSize: this.limit,
      });
      yield data.items;

      shouldStop = !data.meta.page.hasMore;
      currentPage++;
    } while (!shouldStop);
  }

  public async getAllRecords<T>(path: string, queryParams?: ITeamworkQueryParams) {
    const iterator = this.getAllRecordsIterator(path, queryParams);
    let records: T[] = [];
    for await (const nextChunk of iterator) {
      // The Teamwork API response structure is not aligned with the expected type, so we use `as T[]` to manually cast the data to the correct type.
      records = records.concat(nextChunk as T[]);
    }

    return records;
  }

  public async getRecords(path: string, params?: ITeamworkQueryParams) {
    const data = await this.sendGetRequest<ITeamworkResponse>(path, params);
    return TeamworkApi.transformResponse(data);
  }

  getAllProjects() {
    return this.getAllRecords<ITeamworkProject>(TEAMWORK_PATHS.PROJECTS);
  }

  getAllPeople() {
    return this.getAllRecords<ITeamworkPeople>(TEAMWORK_PATHS.PEOPLE);
  }

  getAllTasks(projectId: number) {
    const path = TEAMWORK_PATHS.TASKS(projectId);
    return this.getAllRecords<ITeamworkTask>(path, {
      include: 'cards.columns',
    });
  }
}
