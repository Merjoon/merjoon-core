import { HttpClient } from '../common/HttpClient';
import {
  IZohoPostOauthBody,
  IZohoRefreshTokenResponse,
  IZohoConfig,
  IZohoUsers,
  IZohoPortals,
} from './types';
import { HttpMethod, IHttpRequestConfig, IMerjoonApiConfig, IResponseConfig } from '../common/types';
import { ZOHO_PATHS } from './const';
import { HttpError } from '../common/HttpError';

export class ZohoApi extends HttpClient {
  constructor(protected config: IZohoConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: `https://projectsapi.zoho.${config.rootDomain}/restapi/`,
    };
    super(apiConfig);
  }
  protected async postOauthToken(): Promise<string> {
    const { refreshToken, clientId, clientSecret, rootDomain } = this.config;
    const response = await this.post<IZohoRefreshTokenResponse, IZohoPostOauthBody>({
      path: 'oauth/v2/token',
      base: `https://accounts.zoho.${rootDomain}`,
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

  public getPortals() {
    return this.sendGetRequest<IZohoPortals>(ZOHO_PATHS.PORTALS);
  }

  public getUsers(portalId: number) {
    return this.sendGetRequest<IZohoUsers>(ZOHO_PATHS.USERS(portalId));
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
