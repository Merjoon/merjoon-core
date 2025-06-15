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
  private accessToken: string;
  constructor(protected config: IQuireConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://quire.io/api/',
    };
    super(apiConfig);
    this.accessToken = '';
  }
  getAccessToken(): string {
    return this.accessToken;
  }
  async refreshAccessToken(): Promise<void> {
    try {
      const response = await this.post<IRefreshTokenResponse>({
        path: 'oauth/token',
        base: 'https://quire.io',
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.config.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        }),
        config: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      });
      this.accessToken = response.data.access_token;
    } catch {
      throw new Error('Unable to refresh access token');
    }
  }
  async init(): Promise<string> {
    if (!this.accessToken) {
      await this.refreshAccessToken();
      this.setAuthHeader(this.accessToken);
    }
    return this.accessToken;
  }

  async sendGetRequest<T>(path: string, queryParams?: Record<string, string>): Promise<T> {
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
        });
        return response.data;
      }
      throw err;
    }
  }

  public getRecords<T>(path: string, queryParams?: Record<string, string>): Promise<T[]> {
    return this.sendGetRequest<T[]>(path, queryParams);
  }

  public getProjects() {
    return this.getRecords<IQuireProject>(QUIRE_PATHS.PROJECTS);
  }

  public getUsers() {
    return this.getRecords<IQuireUser>(QUIRE_PATHS.USER);
  }

  public getTasks(oid: string) {
    return this.getRecords<IQuireTask>(QUIRE_PATHS.TASK(oid));
  }
}
