import { ITeamworkConfig, TeamworkApiPath } from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class TeamworkApi extends HttpClient {

  protected readonly encodedCredentials: string;


  constructor(protected config: ITeamworkConfig) {
    const basePath = `https://${config.subdomain}.teamwork.com`
    super(basePath);
    this.encodedCredentials = Buffer.from(`${config.token}:${config.password}`).toString('base64');
  }

  public sendRequest(path: TeamworkApiPath, queryParams?: Object) {
    const config: IRequestConfig = {
      headers: {
        'Authorization': `Basic ${this.encodedCredentials}`
      }
    }
    return this.get({
      path,
      config,
      queryParams,
    })
  }
}
