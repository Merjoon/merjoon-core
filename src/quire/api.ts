import axios, { AxiosInstance } from 'axios';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { IQuireConfig, IQuireProject, IQuireTask, IQuireUser } from './types';
import { QUIRE_PATHS } from './const';

export class QuireApi extends HttpClient {
  private accessToken: string;
  private refreshToken: string;
  private instance: AxiosInstance;

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
    this.instance = axios.create(apiConfig);
  }

  async refreshAccessToken() {
    try {
      const response = await this.instance.post(
        'https://quire.io/oauth/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
      this.setAuthorizationHeader(this.accessToken);
    } catch {
      throw new Error('Unable to refresh access token');
    }
  }

  private setAuthorizationHeader(token: string) {
    if (this.instance) {
      this.instance.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }

  protected async sendGetRequest<T>(
    path: string,
    queryParams?: { limit: number; next: string | undefined },
  ): Promise<T> {
    try {
      const response = await this.instance.get<T>(path, {
        params: queryParams,
      });

      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        await this.refreshAccessToken();
        const response = await this.instance.get<T>(path, {
          params: queryParams,
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
