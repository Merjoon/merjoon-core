import { ITeamworkConfig, ITeamworkQueryParams } from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import * as https from 'https';

export class TeamworkApi extends HttpClient {
  constructor(protected config: ITeamworkConfig) {
    const httpsAgent = config.httpsAgent ?? new https.Agent({
      keepAlive: true,
      maxSockets: 10,
    });

    const basePath = `https://${config.subdomain}.teamwork.com/projects/api/v3/`;

    const encodedCredentials = Buffer.from(`${config.token}:${config.password}`).toString('base64');

    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
      httpsAgent,
    };

    super(apiConfig);
  }

  public async sendGetRequest(path: string, queryParams?: ITeamworkQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });
    return response;
  }
}
