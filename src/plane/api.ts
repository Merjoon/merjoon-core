import https from 'https';
import { HttpClient } from '../common/HttpClient';
import { IPlaneConfig, IPlaneProject } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { PLANE_PATH } from './consts';

export class Plane extends HttpClient {
  constructor(protected config: IPlaneConfig) {
    const basePath = 'https://api.plane.so/api/v1/workspaces/merjoon';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'X-API-Key': `${config.token}`,
      },
    };
    if (config.httpsAgent) {
      apiConfig.httpsAgent = new https.Agent({
        keepAlive: true,
        maxSockets: config.httpsAgent.maxSockets,
      });
    }
    super(apiConfig);
  }

  public async getAllProjects(): Promise<IPlaneProject[]> {
    const data = await this.sendGetRequest(PLANE_PATH.PROJECTS);
    return data.results || data;
  }

  protected async sendGetRequest(path: string) {
    return this.get({ path });
  }
}
