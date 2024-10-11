import {IClickUpConfig, ClickUpApiPath, IClickUpList, IClickUpItem, IClickUpTaskResponse, IClickUpQueryParams} from './types';
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
    const config = this.getConfig();
    this.team_ids = await this.fetchIds(`team`, config);
    this.space_ids = await this.fetchMultiple(`team`, this.team_ids, 'space', config);
    this.folder_ids = await this.fetchMultiple(`space`, this.space_ids, 'folder', config);
    const lists_ids = await this.fetchMultiple(`folder`, this.folder_ids, 'list', config);
    const folderless_list_ids = await this.fetchMultiple(`space`, this.space_ids, 'list', config);
    this.list_ids = lists_ids.concat(folderless_list_ids)
  }

  static uniqueById(array: IClickUpItem[]) {
    const seen = new Set();
    return array.filter(item => {
      const isDuplicate = seen.has(item.id);
      seen.add(item.id);
      return !isDuplicate;
    });
  };

  protected getConfig(): IRequestConfig {
    return {
      headers: {
        Authorization: this.apiKey
      }
    };
  }

  protected async fetchIds(path: string, config: IRequestConfig): Promise<string[]> {
    const items = await this.getItems(`/${path}`, config);
    return this.getIds(items[`${path}s`]);
  }

  protected async fetchMultiple(basePath: string, ids: string[] | undefined, subPath: string, config: IRequestConfig) {
    if (!ids) throw new Error('Ids not properly initialized');
    const allItems = (await Promise.all(ids.map(async (id) => {
      const path = `/${basePath}/${id}/${subPath}`;
      const items = await this.getItems(path, config);
      return items[`${subPath}s`];
    }))).flat();

    if (subPath === 'list') {
      if (this.lists) {
        this.lists = this.lists.concat(allItems);
      } else {
        this.lists = allItems;
      }
    }
    return await this.getIds(allItems);
  }

  protected async getItems(path: string, config: IRequestConfig, queryParams?: IClickUpQueryParams) {
    return this.get({
      path,
      config,
      queryParams
    });
  }

  protected async getIds(items: IClickUpItem[]) {
    return items.map((item: IClickUpItem) => item.id);
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  public async sendGetRequest(path: ClickUpApiPath): Promise<any> {
    if (!this.lists || !this.list_ids) throw new Error(`Ids not properly initialized`);
    switch (path) {
      case ClickUpApiPath.Lists:
        return this.lists;
        
      case ClickUpApiPath.Members:
        return ClickUpApi.uniqueById((await Promise.all((this.list_ids as string[]).map(async (list_id) => {
          const request_path = `/list/${list_id}/` + String(path);
          return  (await this.getItems(request_path, this.getConfig()))[`${String(path)}s`];
        }))).flat());

      case ClickUpApiPath.Tasks:
        return (await Promise.all((this.list_ids as string[]).map(async (list_id) => {
          const request_path = `/list/${list_id}/` + String(path);
          return  (await this.getItems(request_path, this.getConfig()))[`${String(path)}s`];
        }))).flat();
      
    }
  }

  public async sendGetTaskRequest(queryParams?: IClickUpQueryParams): Promise<IClickUpTaskResponse> {
    if (!this.list_ids) throw new Error(`Ids not properly initialized`);
    
    let isLastPage = true
    const allItems = (await Promise.all((this.list_ids as string[]).map(async (list_id) => {
      const request_path = `/list/${list_id}/task`;
      const items = await this.getItems(request_path, this.getConfig(), queryParams);
      isLastPage = isLastPage && items.last_page;
      return  items.tasks;
    }))).flat();
    return {
      tasks: allItems,
      lastPage: isLastPage,
    }
  }
  
}