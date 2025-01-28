import * as http from 'https';
import { ITeamworkConfig, ITeamworkQueryParams } from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';

export class TeamworkApi extends HttpClient {
  constructor(protected config: ITeamworkConfig) {
    const httpsAgent = config.httpsAgent || {};
    const agent = new http.Agent({
      keepAlive: true,
      maxSockets: httpsAgent.maxSockets ?? 10,
    });

    const basePath = `https://${config.subdomain}.teamwork.com/projects/api/v3/`;
    const encodedCredentials = Buffer.from(`${config.token}:${config.password}`).toString('base64');

    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
      httpsAgent: agent,
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
