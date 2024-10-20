import {IClickUpConfig, IClickUpQueryParams} from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class ClickUpApi extends HttpClient {

  protected readonly apiKey: string;

  constructor(protected config: IClickUpConfig) {
    const basePath = `https://api.clickup.com/api/v2`;
    super(basePath);
    this.apiKey = config.apiKey;
  }

  public async getTeams() {
    const path = 'team';
    return this.sendGetRequest(path);
  }

  public async getSpaces(teamId: string) {
    return this.getItems('team', teamId, 'space');
  }

  public async getFolders(spaceId: string) {
    return this.getItems('space', spaceId, 'folder');
  }

  public async getLists(folderId: string) {
    return this.getItems('folder', folderId, 'list');
  }

  public async getFolderless(spaceId: string) {
    return this.getItems('space', spaceId, 'list')
  }

  public async getTasks(listId: string, queryParams: IClickUpQueryParams) {
    return this.getItems('list', listId, 'task', queryParams);
  }

  protected getConfig(): IRequestConfig {
    return {
      headers: {
        Authorization: this.apiKey
      }
    };
  }

  protected async getItems(basePath: string, id: string, subPath: string, queryParams?: IClickUpQueryParams) {
      const path = `/${basePath}/${id}/${subPath}`;
      const items = await this.sendGetRequest(path, queryParams);
      return items;
  }

  protected async sendGetRequest(path: string, queryParams?: IClickUpQueryParams) {
    const config = this.getConfig();

    return this.get({
      path,
      config,
      queryParams
    });
  }
}