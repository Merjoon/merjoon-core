import { HttpClient } from '../common/HttpClient';
import { IGitLabConfig, IGitLabQueryParams} from './types';
import { IMerjoonApiConfig } from '../common/types';
import * as https from 'https';

export class GitLab extends HttpClient {
  constructor(protected config: IGitLabConfig) {
    const httpsAgent = config.httpsAgent ?? new https.Agent({
      keepAlive: true,
      maxSockets: 10,
    });
    const basePath = 'https://gitlab.com/api/v4';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'PRIVATE-TOKEN': `${config.token}`,
      },
      httpsAgent,
    };

    super(apiConfig);
  }

  public async sendGetRequest(path: string, queryParams?: IGitLabQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });
    return response;
  };
};
