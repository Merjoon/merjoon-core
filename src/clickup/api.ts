import {IClickUpConfig, ClickUpApiPath, IClickUpList, IClickUpItem, IClickUpTaskResponse, IClickUpQueryParams} from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class ClickUpApi extends HttpClient {

  protected readonly apiKey: string;
  
  // protected lists: IClickUpList[] | undefined;

  constructor(protected config: IClickUpConfig) {
    const basePath = `https://api.clickup.com/api/v2`;
    super(basePath);
    this.apiKey = config.apiKey;
  }

  

  protected getConfig(): IRequestConfig {
    return {
      headers: {
        Authorization: this.apiKey
      }
    };
  }

  


  // return without await
  // protected async fetchMultiple(basePath: string, ids: string[] | undefined, subPath: string, config: IRequestConfig) {
  //   if (!ids) throw new Error('Ids not properly initialized');
  //   const allItems = (await Promise.all(ids.map(async (id) => {
  //     const path = `/${basePath}/${id}/${subPath}`;
  //     const items = await this.getItems(path, config);
  //     return items[`${subPath}s`];
  //   }))).flat();

  //   if (subPath === 'list') {
  //     if (this.lists) {
  //       this.lists = this.lists.concat(allItems);
  //     } else {
  //       this.lists = allItems;
  //     }
  //   }
  //   return await this.getIds(allItems);
  // }

  protected async getItems(path: string, config: IRequestConfig, queryParams?: IClickUpQueryParams) {
    return this.get({
      path,
      config,
      queryParams
    });
  }

  
}