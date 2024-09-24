import { IHiveConfig, IHiveQueryParams, RESULT_KEY, HiveApiPath } from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class HiveApi extends HttpClient {

  protected readonly api_key: string;
  protected readonly user_id: string;


  constructor(protected config: IHiveConfig) {
    const basePath = `https://app.hive.com/api/v1/workspaces/${config.workspaceId}`;
    super(basePath);
    this.api_key = config.api_key;
    this.user_id = config.user_id
  }

  public async sendGetRequest(path: HiveApiPath, queryParams?: IHiveQueryParams) {
    const config: IRequestConfig = {
      headers: {
        'api_key': `${this.api_key}`,
        'user_id': `${this.user_id}`,
      }
    }

    const response = await this.get({
      path,
      config,
      queryParams,
    })

    const key = RESULT_KEY[path];
    return response[key]
  }
}
