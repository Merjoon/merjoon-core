import {IClickUpConfig, ClickUpApiPath, ClickUpSubdomain, IClickUpList, IClickUpItem} from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class ClickUpApi extends HttpClient {

  protected readonly apiKey: string;
  protected team_ids: string[] | undefined;
  protected space_ids: string[] | undefined;
  protected folder_ids: string[] | undefined;
  protected list_ids: string[] | undefined;
  protected lists: IClickUpList[] | undefined;

  constructor(protected config: IClickUpConfig) {
    const basePath = `https://api.clickup.com/api/v2`;
    super(basePath);
    this.apiKey = config.apiKey;
  }

  public async init() {
    const config: IRequestConfig = {
      headers: {
        Authorization: `${this.apiKey}`
      }
    }
    let path = '/team';
    const items = await this.getItems(path, config);
    this.team_ids = await this.getIds(items.teams);

    this.space_ids = (await Promise.all(this.team_ids?.map(async (team_id) => {
      path = `/team/${team_id}/space`;
      const items = await this.getItems(path, config);
      return await this.getIds(items.spaces);
    }))).flat();

    this.folder_ids = (await Promise.all(this.space_ids?.map(async (space_id) => {
      path = `/space/${space_id}/folder`;
      const items = await this.getItems(path, config);
      return this.getIds(items.folders);
    }))).flat();

    let lists = (await Promise.all(this.folder_ids?.map(async (folder_id) => {
      path = `/folder/${folder_id}/list`;
      const items = await this.getItems(path, config);
      this.lists = items.lists;
      return this.getIds(items.lists);
    }))).flat();

    let folderless_lists = (await Promise.all(this.space_ids?.map(async (space_id) => {
      path = `/space/${space_id}/list`;
      const items = await this.getItems(path, config);
      this.lists = this.lists?.concat(items.lists);
      return this.getIds(items.lists);
    }))).flat();

    this.list_ids = lists.concat(folderless_lists);
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

  public async sendGetRequest(path: ClickUpApiPath): Promise<any> {
    switch (path) {
      case ClickUpApiPath.Lists:
        if (!this.lists) {
          throw new Error('Something went wrong');
        } else {
          return this.lists;
        }
      case ClickUpApiPath.Members:
      case ClickUpApiPath.Tasks:
        if (!this.list_ids) {
          throw new Error('Something went wrong');
        } else {
          const config: IRequestConfig = {
            headers: {
              Authorization: `${this.apiKey}`
            }
          }
          return (await Promise.all(this.list_ids.map(async (list_id) => {
            const request_path = `/list/${list_id}/` + String(path);
            return  (await this.getItems(request_path, config))[`${String(path)}s`];
          }))).flat();
        }
    }
  }
}