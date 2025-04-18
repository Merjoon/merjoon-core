import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { IQuireConfig, IQuireProject, IQuireTask, IQuireUser } from './types';
import { QUIRE_PATHS } from './const';

export class QuireApi extends HttpClient {
  constructor(protected config: IQuireConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://quire.io/api/',
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
  }
  protected async sendGetRequest<T>(
    path: string,
    queryParams?: { limit: number; next: string | undefined },
  ): Promise<T> {
    const response = await this.get<T>({
      path,
      queryParams,
    });
    return response.data;
  }
  public async *getAllRecordsIterator<T extends { nextText?: string }>(
    path: string,
  ): AsyncGenerator<T[], void> {
    let nextText: string | undefined;
    let previousNextText: string | undefined;

    while (true) {
      const queryParams = {
        limit: this.config.limit,
        next: nextText ?? undefined,
      };

      const items: T[] = await this.sendGetRequest<T[]>(path, queryParams);

      if (!items.length) {
        break;
      }
      yield items;

      previousNextText = nextText;
      nextText = items[items.length - 1]?.nextText;

      if (!nextText || nextText === previousNextText) {
        break;
      }
    }
  }
  protected async getAllRecords<T extends { nextText?: string | undefined }>(
    path: string,
  ): Promise<T[]> {
    const iterator = this.getAllRecordsIterator<T>(path);
    const all: T[] = [];

    for await (const chunk of iterator) {
      all.push(...chunk);
    }

    return all;
  }
  public getAllProjects() {
    return this.getAllRecords<IQuireProject>(QUIRE_PATHS.PROJECTS);
  }

  public getAllUsers() {
    return this.getAllRecords<IQuireUser>(QUIRE_PATHS.USER);
  }

  public getAllTasks(oid: string) {
    return this.getAllRecords<IQuireTask>(QUIRE_PATHS.TASK(oid));
  }
}
