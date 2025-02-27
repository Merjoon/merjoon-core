import { IWrikeConfig, IWrikeQueryParams, WrikeApiPath } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { HttpClient } from '../common/HttpClient';

export class WrikeApi extends HttpClient {
  constructor (config: IWrikeConfig) {
    const basePath = 'https://www.wrike.com/api/v4';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
    };
    super(apiConfig);
  }

  public async sendGetRequest(path: WrikeApiPath, queryParams?: IWrikeQueryParams) {
    return this.get({
      path,
      queryParams
    });
  }

  getAllProjects(){
    return this.sendGetRequest(WrikeApiPath.Projects,
      {
        fields: '[description]',
        project: true
      });
  }

  getAllUsers(){
    return this.sendGetRequest(WrikeApiPath.Users);
  }

  getAllTasks() {
    return this.sendGetRequest(WrikeApiPath.Tasks,
      {
        fields: '[responsibleIds, parentIds, description]'
      });
  }
}
