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
    let path = '/team';
    const items = await this.getItems(path, config);
    this.team_ids = await this.getIds(items.teams);

    this.space_ids = (await Promise.all(this.team_ids?.map(async (team_id) => {
      path = `/team/${team_id}/space`;
      const items = await this.getItems(path, config);
      return await this.getIds(items.spaces);
    }) || [])).flat();

    this.folder_ids = (await Promise.all(this.space_ids?.map(async (space_id) => {
      path = `/space/${space_id}/folder`;
      const items = await this.getItems(path, config);
      return this.getIds(items.folders);
    }) || [])).flat();

    let lists = (await Promise.all(this.folder_ids?.map(async (folder_id) => {
      path = `/folder/${folder_id}/list`;
      const items = await this.getItems(path, config);
      this.projects = items.lists;
      return this.getIds(items.lists);
    }) || [])).flat();

    let folderless_lists = (await Promise.all(this.space_ids?.map(async (space_id) => {
      path = `/space/${space_id}/list`;
      const items = await this.getItems(path, config);
      this.projects = this.projects?.concat(items.lists);
      return this.getIds(items.lists);
    }) || [])).flat();

    this.project_ids = lists.concat(folderless_lists);
  }

  protected async getItems(path: string, config: IRequestConfig) {
    return this.get({
      path,
      config
    })
  }
  protected async getIds(items: IClickUpItem[]) {
    return items.map((item: IClickUpItem) => item.id) || [];
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
  api_key: '',
};
// const hive_api = new HiveApi(config);
// hive_api.init();