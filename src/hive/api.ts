import { HiveApiPath, IHiveConfig, IHiveItem } from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class HiveApi extends HttpClient {

  protected readonly apiKey: string;
  protected readonly userId: string;
  protected workspaceIds: string[] | undefined;


  constructor(protected config: IHiveConfig) {
    const basePath = `https://app.hive.com/api/v1/workspaces`;
    super(basePath);
    this.apiKey = config.api_key;
    this.userId = config.user_id;
  }

  protected async getItems(path: string, config: IRequestConfig) {
    return await this.get({
      path,
      config
    });
  }

  protected async getIds(items: IHiveItem[]) {
    return items?.map((item: IHiveItem) => item.id) || [];
  }

  public async init() {
    const items = await this.sendGetRequest(HiveApiPath.Workspaces);
    this.workspaceIds = await this.getIds(items);
    console.log(`workspaceIds = ${this.workspaceIds}`);
  }

  public async sendGetRequest(path: HiveApiPath) {
    const config: IRequestConfig = {
      headers: {
        'api_key': `${this.apiKey}`,
        'user_id': `${this.userId}`,
      }
    };

    return await this.get({
      path,
      config,
    });
  }
}

const config = {
  api_key: ``,
  user_id: ``,
};
const hiveApi = new HiveApi(config);
hiveApi.init();