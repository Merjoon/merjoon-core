import {IClickUpConfig,
   IClickUpQueryParams, 
  IClickUpTeamResponse,
  IClickUpSpaceResponse,
  IClickUpFolderResponse,
  IClickUpListResponse,
  IClickUpTaskResponse,
  IClickUpTask,
} from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';
import { CLICKUP_PATHS } from "./consts";

export class ClickUpApi extends HttpClient {

  protected readonly apiKey: string;

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

  protected async sendGetRequest(path: string, queryParams?: IClickUpQueryParams) {
    const config = this.getConfig();

    return this.get({
      path,
      config,
      queryParams
    });
  }

  protected async* getAllTasksIterator(listId: string): AsyncGenerator<IClickUpTaskResponse> {
    const path = CLICKUP_PATHS.TASKS(listId);
    let lastPage = false;
    let currentPage = 0;
    do {
      try {
        const data: IClickUpTaskResponse = await this.sendGetRequest(path, {
          page: currentPage
        });
        yield data;
        lastPage = data.last_page;
        currentPage++;
      } catch (e: unknown) {
        if (e instanceof Error) {
          throw new Error(e.message);
        }
      }
    } while (!lastPage)
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

  public async getListAllTasks(listId: string, queryParams: IClickUpQueryParams): Promise<IClickUpTask[]> {
    const iterator: AsyncGenerator<IClickUpTaskResponse> = this.getAllTasksIterator(listId);
    const records: IClickUpTask[] = [];

    for await (const nextChunk of iterator) {
      records.push(...nextChunk.tasks)
    }

    return records;
  }
}
