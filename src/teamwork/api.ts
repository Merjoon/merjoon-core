import {
  ITeamworkConfig,
  ITeamworkQueryParams,
  ITeamworkIncludedData,
  ITeamworkObject,
  ITeamworkvalue,
  ITeamworkItem,
  ITeamworkResponse,
} from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { TEAMWORK_PATHS } from './consts';

export class TeamworkApi extends HttpClient {
  static transformResponse(response: ITeamworkResponse) {
    function result(obj: ITeamworkObject) {
      for (const entry of Object.entries(obj)) {
        const key = entry[0] as keyof ITeamworkObject;
        const value = entry[1] as ITeamworkvalue;
        if (Array.isArray(value)) {
          Object.assign(obj, {
            [key]: value.map((v: ITeamworkItem) => {
              if (v.id && v?.type) {
                const includedItem =
                  response.included[v.type as keyof ITeamworkIncludedData]?.[v.id];
                if (includedItem) {
                  return result(includedItem);
                }
              }
              return v;
            }),
          });
        } else if (typeof value === 'object' && value !== null) {
          if (value.id && value.type) {
            const includedItem =
              response.included[value.type as keyof ITeamworkIncludedData]?.[value.id];
            if (includedItem) {
              Object.assign(obj, {
                [key]: result(includedItem),
              });
            }
          }
        }
      }
      return obj;
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

  public async getAllRecords(path: string, queryParams?: ITeamworkQueryParams) {
    const iterator = this.getAllRecordsIterator(path, queryParams);
    let records: ITeamworkObject[] = [];
    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getRecords(path: string, params?: ITeamworkQueryParams) {
    const data = await this.sendGetRequest(path, params);
    return TeamworkApi.transformResponse(data);
  }

  getAllProjects() {
    return this.getAllRecords(TEAMWORK_PATHS.PROJECTS);
  }

  getAllPeople() {
    return this.getAllRecords(TEAMWORK_PATHS.PEOPLE);
  }

  getAllTasks() {
    return this.getAllRecords(TEAMWORK_PATHS.TASKS, {
      include: 'cards.columns',
    });
  }
}
