import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IClickUpMember, IClickUpList, IClickUpTask, ClickUpApiPath, IClickUpTaskResponse, IClickUpItem } from './types';
import { ClickUpTransformer } from './transformer';
import { ClickUpApi } from './api';

export class ClickUpService implements IMerjoonService {

  protected teamIds: string[] | undefined;
  protected spaceIds: string[] | undefined;
  protected folderIds: string[] | undefined;
  protected listIds: string[] | undefined;

  constructor(public readonly api: ClickUpApi, public readonly transformer: ClickUpTransformer) {
  }

  static uniqueById(array: IClickUpItem[]) {
    const seen = new Set();
    return array.filter(item => {
      const isDuplicate = seen.has(item.id);
      seen.add(item.id);
      return !isDuplicate;
    });
  };

  protected getIds(items: IClickUpItem[]) {
    return items.map((item: IClickUpItem) => item.id);
  }

  // protected async getAllRecords<T>(path: ClickUpApiPath) {
  //   const records: T[] = await this.api.sendGetRequest(path);
  //   return records;
  // }

  // protected async* getAllTasksIterator(): AsyncGenerator<IClickUpTaskResponse> {
  //   let lastPage = false;
  //   let currentPage = 0;
  //   do {
  //     try {
  //       const data: IClickUpTaskResponse = await this.api.sendGetTaskRequest({
  //         page: currentPage
  //       });
  //       yield data;
  //       lastPage = data.lastPage;
  //       currentPage++;
  //       // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  //     } catch (e: any) {
  //       throw new Error(e.message);
  //     }
  //   } while (!lastPage)
  // }

  // protected async getAllTasks(): Promise<IClickUpTask[]> {
  //   const iterator: AsyncGenerator<IClickUpTaskResponse> = this.getAllTasksIterator();
  //   let records: IClickUpTask[] = [];

  //   for await (const nextChunk of iterator) {
  //     records = records.concat(nextChunk.tasks);
  //   }

  //   return records;
  // }

  public async sendGetRequest(path: ClickUpApiPath): Promise<any> {
    // if (!this.lists || !this.list_ids) throw new Error(`Ids not properly initialized`);
    // switch (path) {
    //   case ClickUpApiPath.Lists:
    //     return this.lists;
        
    //   case ClickUpApiPath.Members:
    //     return ClickUpApi.uniqueById((await Promise.all((this.list_ids as string[]).map(async (list_id) => {
    //       const request_path = `/list/${list_id}/` + String(path);
    //       return  (await this.getItems(request_path, this.getConfig()))[`${String(path)}s`];
    //     }))).flat());

    //   case ClickUpApiPath.Tasks:
    //     return (await Promise.all((this.list_ids as string[]).map(async (list_id) => {
    //       const request_path = `/list/${list_id}/` + String(path);
    //       return  (await this.getItems(request_path, this.getConfig()))[`${String(path)}s`];
    //     }))).flat();
      
    // }
  }

  public async sendGetTaskRequest(queryParams?: IClickUpQueryParams): Promise<IClickUpTaskResponse> {
  //   if (!this.list_ids) throw new Error(`Ids not properly initialized`);
    
  //   let isLastPage = true
  //   const allItems = (await Promise.all((this.list_ids as string[]).map(async (list_id) => {
  //     const request_path = `/list/${list_id}/task`;
  //     const items = await this.getItems(request_path, this.getConfig(), queryParams);
  //     isLastPage = isLastPage && items.last_page;
  //     return  items.tasks;
  //   }))).flat();
  //   return {
  //     tasks: allItems,
  //     lastPage: isLastPage,
  //   }
  }

  protected async getItems(name: string, ids: string[]) {
    let items: any[] = [];
    for (const id of ids) {
      const chunk = await (this.api as any)[`get${name.charAt(0).toUpperCase() + name.slice(1)}s`](id);
      items = items.concat(chunk[`${name}s`]);
    }
    return items;
  }

  protected async getTeams() {
    const teams = this.api.getTeams();
    return teams['teams'];
  }

  protected async getSpaces() {
    if (!this.teamIds) {
      throw new Error('Team IDs not found');
    }
    return this.getItems('space', this.teamIds);
  }

  protected async getFolders() {
    if (!this.spaceIds) {
      throw new Error('Space IDs not found');
    }
    return this.getItems('folder', this.spaceIds);
  }

  protected async getLists() {
    if (!this.folderIds) {
      throw new Error('Folder IDs not found');
    }
    return this.getItems('list', this.folderIds);
  }

  protected async getFolderlessLists() {
    if (!this.spaceIds) {
      throw new Error('SpaceIDs not found');
    };
    return this.getItems('folderless', this.spaceIds);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const teams = await this.getTeams();
    this.teamIds = this.getIds(teams);
    const members = this.getMembers();
    return this.transformer.transformMembers(members);
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    if (!this.teamIds) {
      throw new Error('Space IDs not found');
    }
    const spaces = await this.getSpaces();
    this.spaceIds = this.getIds(spaces);
    const folders = await this.getFolders();
    this.folderIds = this.getIds(folders);
    const lists = await this.getLists();
    const folderlessLists = await this.getFolderlessLists();
    lists.push(...folderlessLists);
    this.listIds = this.getIds(lists);
    return this.transformer.transformLists(lists);

  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.listIds) {
      throw new Error('List IDs not found');
    }
    const tasks = await this.getAllTasks();
    return this.transformer.transformTasks(tasks);
  }
}