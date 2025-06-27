import { HttpClient } from '../common/HttpClient';
import { HttpRequestError } from '../common/HttpsRequestError';
import { IMerjoonApiConfig, IResponseConfig } from '../common/types';
import {
  IQuireBody,
  IQuireConfig,
  IQuireProject,
  IQuireTask,
  IQuireUser,
  IRefreshTokenResponse,
} from './types';
import { QUIRE_PATHS } from './const';
export class QuireApi extends HttpClient {
  constructor(protected config: IQuireConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://quire.io/api/',
    };
    super(apiConfig);
  }
  protected async postOauthToken(): Promise<string> {
    const { refreshToken, clientId, clientSecret } = this.config;
    const response = await this.post<IRefreshTokenResponse, IQuireBody>({
      path: 'oauth/token',
      base: 'https://quire.io',
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      },
      config: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    });
    return response.data.access_token;
  }

  protected async updateAuthHeader(): Promise<void> {
    const token = await this.postOauthToken();
    this.setDefaultHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  public async init(): Promise<void> {
    await this.updateAuthHeader();
  }
  protected async sendGetRequest<T>(path: string): Promise<T> {
    const response = await this.get<T>({
      path,
    });
    return response.data;
  }

  public getRecords<T>(path: string): Promise<T[]> {
    return this.sendGetRequest<T[]>(path);
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
    ...parameters: Parameters<HttpClient['sendRequest']>
  ): Promise<IResponseConfig<T>> {
    try {
      return await super.sendRequest<T>(...parameters);
    } catch (error) {
      if (error instanceof HttpRequestError && error?.status === 401) {
        await this.updateAuthHeader();
        return this.sendRequest<T>(...parameters);
      }
      throw error;
    }
  }
}
