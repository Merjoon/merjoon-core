import { ITeamworkConfig, ITeamworkQueryParams, RESULT_KEY, TeamworkApiPath } from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';

export class TeamworkApi extends HttpClient {

  constructor(protected config: ITeamworkConfig) {
    const basePath = `https://${config.subdomain}.teamwork.com`;
    const encodedCredentials = Buffer.from(`${config.token}:${config.password}`).toString('base64');
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
      },
    };
    super(apiConfig);
  }

  public async sendGetRequest(path: TeamworkApiPath, queryParams?: ITeamworkQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });

    const key = RESULT_KEY[path];
    return response[key];
  }
}
