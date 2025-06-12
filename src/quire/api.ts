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
  public getRecords<T>(
    path: string,
    queryParams?: Record<string, string | number | undefined>,
  ): Promise<T[]> {
    return this.sendGetRequest<T[]>(path, queryParams);
  }

  public getAllProjects() {
    return this.getRecords<IQuireProject>(QUIRE_PATHS.PROJECTS);
  }

  public getAllUsers() {
    return this.getRecords<IQuireUser>(QUIRE_PATHS.USER);
  }

  public getAllTasks(oid: string) {
    return this.getRecords<IQuireTask>(QUIRE_PATHS.TASK(oid));
  }
}
