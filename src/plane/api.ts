import { HttpClient } from '../common/HttpClient';
import { IPlaneConfig, IPlaneProject, IPlaneResponse } from './types';
import { IMerjoonApiConfig } from '../common/types';
import { PLANE_PATH } from './consts';

export class PlaneApi extends HttpClient {
  constructor(protected config: IPlaneConfig) {
    const basePath = `https://api.plane.so/api/v1/workspaces/${config.workspaceSlug}`;
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'X-API-Key': config.apiKey,
      },
    };
    super(apiConfig);
  }

  public async getAllProjects() {
    const data = await this.sendGetRequest<IPlaneResponse<IPlaneProject>>(PLANE_PATH.PROJECTS);
    return data.results;
  }

  protected async sendGetRequest<T>(path: string) {
    const response = await this.get<T>({
      path,
    });
    return response.data;
  }
}
