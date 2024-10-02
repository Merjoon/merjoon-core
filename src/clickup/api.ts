import {IClickUpConfig, ClickUpApiPath, ClickUpSubdomain, IClickUpProject, IClickUpItem} from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class HiveApi extends HttpClient {

  protected readonly api_key: string;
  protected team_ids: string[] | undefined;
  protected space_ids: string[] | undefined;
  protected folder_ids: string[] | undefined;
  protected project_ids: string[] | undefined;
  protected projects: IClickUpProject[] | undefined;

  constructor(protected config: IClickUpConfig) {
    const basePath = `https://api.clickup.com/api/v2`;
    super(basePath);
    this.api_key = config.api_key;
  }

  public async init() {
    const config: IRequestConfig = {
      headers: {
        Authorization: `${this.api_key}`
      }
    }
    let path = '/team'
    this.team_ids = await this.getIds(path, config);
    this.space_ids = await Promise.all(this.team_ids.map((team_id) => {
      path = `/team/${team_id}/space`;
      return this.getIds(path, config);
    }));
    console.log(`team_ids = ${this.team_ids}`);
    console.log(`space_ids = ${this.space_ids}`);
  }

  protected async getIds(path: string, config: IRequestConfig) {
    const items = await this.get({
      path,
      config
    })
    return items.map((item: IClickUpItem) => item.id);
  }
  // public async sendGetRequest(path: ClickUpApiPath) {
  //   const subdomain = ClickUpSubdomain[path];
  //   const token_name = subdomain + '_ids';
  //   const tokens = await this.getTokens(subdomain);
  //   let responses = [];
  //   //for token in tokens:
  //     //whole_path = `/${subdomain}/${token}/${path}
  //   const config: IRequestConfig = {
  //     headers: {
  //       Authorization: `${this.api_key}`
  //     }
  //   }
  //
  //   const response = await this.get({
  //     path,
  //     config,
  //   })
  //   // responses.push(response
  //   return response?response:{};
  // }
}

const config: IClickUpConfig = {
  api_key: 'pk_84675803_K6ZYJHRX5915YTOE6DPOGDEI8V0H736Z',
};
const hive_api = new HiveApi(config);
hive_api.init();