import axios from 'axios';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig, IResponseConfig } from '../common/types';
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
  protected async postOauthToken(): Promise<void> {
    try {
      const response = await this.post<IRefreshTokenResponse>({
        path: 'oauth/token',
        base: 'https://quire.io',
        body: {
          grant_type: 'refresh_token',
          refresh_token: this.config.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        },
        config: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      });
      this.accessToken = response.data.access_token;
    } catch {
      throw new Error('Unable to post for new token');
    }
  }
  protected async updateAuthHeader(): Promise<string> {
    await this.postOauthToken();
    this.setDefaultHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.accessToken;
  }

  public async init(): Promise<string> {
    await this.updateAuthHeader();
    return this.accessToken;
  }
  protected async sendGetRequest<T>(path: string, queryParams?: object): Promise<T> {
    const response = await this.get<T>({
      path,
      queryParams,
    });
    return response.data;
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
  protected async sendRequest<T>(
    method: axios.Method,
    url: string,
    data?: object,
    config?: axios.AxiosRequestConfig,
  ): Promise<IResponseConfig<T>> {
    try {
      return await super.sendRequest(method, url, data, config);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          await this.updateAuthHeader();
          return await this.sendRequest<T>(method, url, data, config);
        } catch (retryError) {
          if (axios.isAxiosError(retryError)) {
            throw {
              data: retryError.response?.data,
              status: retryError.response?.status,
              headers: retryError.response?.headers,
            };
          }
          throw retryError;
        }
      }

      throw error;
    }
  }
}
