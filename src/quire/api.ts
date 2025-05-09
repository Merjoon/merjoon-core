import { AxiosError } from 'axios';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import {
  IQuireConfig,
  IQuireProject,
  IQuireTask,
  IQuireUser,
  IRefreshTokenResponse,
} from './types';
import { QUIRE_PATHS } from './const';

export class QuireApi extends HttpClient {
  accessToken: string;
  refreshToken: string;
  private clientId: string;
  private clientSecret: string;
  limit: number;

  constructor(protected config: IQuireConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://quire.io/api/',
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
    this.accessToken = config.token;
    this.refreshToken = config.refreshToken;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.limit = config.limit || 10;
  }
  async refreshAccessToken(): Promise<void> {
    try {
      const response = await this.post<IRefreshTokenResponse>({
        path: 'oauth/token',
        base: 'https://quire.io',
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        config: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    } catch {
      throw new Error('Unable to refresh access token');
    }
  }

  async sendGetRequest<T>(
    path: string,
    queryParams?: Record<string, string | number | undefined>,
  ): Promise<T> {
    try {
      const response = await this.get<T>({
        path,
        queryParams,
      });
      return response.data;
    } catch (err) {
      const x = err as AxiosError;
      if (x.status === 401) {
        await this.refreshAccessToken();
        const response = await this.get<T>({
          path,
          queryParams,
          config: {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          },
        });
        return response.data;
      }
      throw err;
    }
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

      const items: T[] = await this.getRecords<T>(path, queryParams);

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

  protected async getAllRecords<T extends { nextText?: string }>(path: string): Promise<T[]> {
    const iterator = this.getAllRecordsIterator<T>(path);
    const all: T[] = [];

    for await (const chunk of iterator) {
      all.push(...chunk);
    }

    return all;
  }

  public getRecords<T>(
    path: string,
    queryParams?: Record<string, string | number | undefined>,
  ): Promise<T[]> {
    return this.sendGetRequest<T[]>(path, queryParams);
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
