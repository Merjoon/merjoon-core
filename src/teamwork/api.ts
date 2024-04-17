import { HttpClient } from '../common/HttpClient';
import { ITeamworkConfig, TeamworkApiPath } from './types';
import { IRequestConfig } from '../common/types';

export class TeamworkApi extends HttpClient {
  constructor(protected config: ITeamworkConfig) {
    const basePath = `https://${config.subdomain}.teamwork.com`
    super(basePath);
  }

  public sendRequest(path: TeamworkApiPath) {
    const encoded = Buffer.from(`${this.config.token}:${this.config.password}`).toString('base64')
    const config: IRequestConfig = {
      headers: {
        'Authorization': `Basic ${encoded}`
      }
    }
    return this.get({
      path,
      config,
    })
  }
}
