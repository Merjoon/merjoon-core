import { HttpClient } from '../common/HttpClient';
import { HttpError } from '../common/HttpError';
import {
  IHttpRequestConfig,
  HttpMethod,
  IMerjoonApiConfig,
  IResponseConfig,
} from '../common/types';
import {
  IQuirePostOauthBody,
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
      httpAgent: {
        maxSockets: config.maxSockets,
      },
    };
    super(apiConfig);
  }
  protected async postOauthToken(): Promise<string> {
    const { refreshToken, clientId, clientSecret } = this.config;
    const response = await this.post<IRefreshTokenResponse, IQuirePostOauthBody>({
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

  public getTasks(projectId: string) {
    return this.getRecords<IQuireTask>(QUIRE_PATHS.TASK(projectId));
  }
  protected async sendRequest<T, D>(
    method: HttpMethod,
    url: string,
    data?: D,
    config?: IHttpRequestConfig<D>,
  ): Promise<IResponseConfig<T>> {
    try {
      return await super.sendRequest<T, D>(method, url, data, config);
    } catch (error) {
      if (error instanceof HttpError && error.status === 401) {
        await this.updateAuthHeader();
        return this.sendRequest<T, D>(method, url, data, config);
      }
      throw error;
    }
  }
}
