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
      httpAgent: { maxSockets: config.maxSockets },
    };
    super(apiConfig);
  }

  protected async sendGetRequest<T>(path: string, queryParams?: IClickUpQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });
    return response.data;
  }

  protected async *getAllTasksIterator(listId: string) {
    let lastPage = false;
    let currentPage = 0;
    do {
      const data = await this.getTasksByListId(listId, {
        page: currentPage,
        reverse: true,
        include_closed: true,
      });
      yield data;
      lastPage = data.last_page;
      currentPage++;
    } while (!lastPage);
  }
  public async getTasksByListId(listId: string, queryParams?: IClickUpQueryParams) {
    const path = CLICKUP_PATHS.TASKS(listId);
    return this.sendGetRequest<IClickUpTaskResponse>(path, queryParams);
  }

  public async getTeams() {
    const path = CLICKUP_PATHS.TEAMS;
    const response = await this.sendGetRequest<IClickUpTeamResponse>(path);
    return response.teams;
  }

  public async getTeamSpaces(teamId: string) {
    const path = CLICKUP_PATHS.SPACES(teamId);
    const response = await this.sendGetRequest<IClickUpSpaceResponse>(path);
    return response.spaces;
  }

  public async getSpaceFolders(spaceId: string) {
    const path = CLICKUP_PATHS.FOLDERS(spaceId);
    const response = await this.sendGetRequest<IClickUpFolderResponse>(path);
    return response.folders;
  }

  public async getFolderLists(folderId: string) {
    const path = CLICKUP_PATHS.LISTS(folderId);
    const response = await this.sendGetRequest<IClickUpListResponse>(path);
    return response.lists;
  }

  public async getSpaceLists(spaceId: string) {
    const path = CLICKUP_PATHS.FOLDERLESS_LISTS(spaceId);
    const response = await this.sendGetRequest<IClickUpListResponse>(path);
    return response.lists;
  }

  public async getListAllTasks(listId: string) {
    const iterator = this.getAllTasksIterator(listId);
    let records: IClickUpTask[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk.tasks);
    }

    return records;
  }
}
