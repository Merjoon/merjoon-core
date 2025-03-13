import { ITeamworkConfig, ITeamworkQueryParams, TeamworkApiPath } from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';

export class TeamworkApi extends HttpClient {
  constructor(protected config: ITeamworkConfig) {
    const basePath = `https://${config.subdomain}.teamwork.com/projects/api/v3/`;

    const encodedCredentials = Buffer.from(`${config.token}:${config.password}`).toString('base64');

    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
      httpAgent: { maxSockets: Number(config.maxSockets) },
    };
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
