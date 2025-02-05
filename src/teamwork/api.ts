import {ITeamworkConfig, ITeamworkQueryParams, TeamworkApiPath} from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import * as https from 'https';

export class TeamworkApi extends HttpClient {
  constructor(protected config: ITeamworkConfig) {
    const basePath = `https://${config.subdomain}.teamwork.com/projects/api/v3/`;

    const encodedCredentials = Buffer.from(`${config.token}:${config.password}`).toString('base64');

    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    };
    if (config.httpsAgent) {
      const agent = new https.Agent({
        keepAlive: true,
        maxSockets: config.httpsAgent.maxSockets
      });
      apiConfig.httpsAgent = agent;
    }

    super(apiConfig);
  }

  public async sendGetRequest(path: TeamworkApiPath, queryParams?: ITeamworkQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });
    return response;
  }
}
