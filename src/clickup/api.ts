import https from 'https';
import {
  IClickUpConfig,
  IClickUpQueryParams,
  IClickUpTeamResponse,
  IClickUpSpaceResponse,
  IClickUpFolderResponse,
  IClickUpListResponse,
  IClickUpTaskResponse,
  IClickUpTask,
} from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { CLICKUP_PATHS } from './consts';

export class ClickUpApi extends HttpClient {
  constructor(protected config: IClickUpConfig) {
    const basePath = 'https://api.clickup.com/api/v2';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: config.apiKey,
      },
      httpsAgent: new https.Agent({
        maxSockets: Number(config.httpsAgent) || 10,
      }),
    };
    super(apiConfig);
  }

  protected async sendGetRequest(path: string, queryParams?: IClickUpQueryParams) {
    return this.get({
      path,
      queryParams,
    });
  }

  protected async *getAllTasksIterator(listId: string): AsyncGenerator<IClickUpTaskResponse> {
    const path = CLICKUP_PATHS.TASKS(listId);
    let lastPage = false;
    let currentPage = 0;
    do {
      const data: IClickUpTaskResponse = await this.sendGetRequest(path, {
        page: currentPage,
      });
      yield data;
      lastPage = data.last_page;
      currentPage++;
    } while (!lastPage);
  }

  public async getTeams() {
    const path = CLICKUP_PATHS.TEAMS;
    const response: IClickUpTeamResponse = await this.sendGetRequest(path);
    return response.teams;
  }

  public async getTeamSpaces(teamId: string) {
    const path = CLICKUP_PATHS.SPACES(teamId);
    const response: IClickUpSpaceResponse = await this.sendGetRequest(path);
    return response.spaces;
  }

  public async getSpaceFolders(spaceId: string) {
    const path = CLICKUP_PATHS.FOLDERS(spaceId);
    const response: IClickUpFolderResponse = await this.sendGetRequest(path);
    return response.folders;
  }

  public async getFolderLists(folderId: string) {
    const path = CLICKUP_PATHS.LISTS(folderId);
    const response: IClickUpListResponse = await this.sendGetRequest(path);
    return response.lists;
  }

  public async getSpaceLists(spaceId: string) {
    const path = CLICKUP_PATHS.FOLDERLESS_LISTS(spaceId);
    const response: IClickUpListResponse = await this.sendGetRequest(path);
    return response.lists;
  }

  public async getListAllTasks(listId: string): Promise<IClickUpTask[]> {
    const iterator: AsyncGenerator<IClickUpTaskResponse> = this.getAllTasksIterator(listId);
    let records: IClickUpTask[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk.tasks);
    }

    return records;
  }
}
