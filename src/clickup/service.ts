import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IClickUpMember, IClickUpTask, IClickUpTaskResponse, IClickUpItem, IClickUpTeam } from './types';
import { ClickUpTransformer } from './transformer';
import { ClickUpApi } from './api';

export class ClickUpService implements IMerjoonService {

  protected teamIds: string[] | undefined;
  protected spaceIds: string[] | undefined;
  protected folderIds: string[] | undefined;
  protected listIds: string[] | undefined;

  constructor(public readonly api: ClickUpApi, public readonly transformer: ClickUpTransformer) {
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const teams = await this.getTeams();
    this.teamIds = this.getIds(teams);
    const members = this.getMembersFromTeams(teams);
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
    const tasks = [];
    for (const listId of this.listIds) {
      const taskChunk = await this.getTasksByListId(listId);
      tasks.push(...taskChunk);
    }
    return this.transformer.transformTasks(tasks);
  }

  protected getIds(items: IClickUpItem[]) {
    return items.map((item: IClickUpItem) => item.id);
  }

  protected async getItems(name: string, ids: string[], key:string) {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const items: any[] = [];
    for (const id of ids) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const chunk = await (this.api as any)[`get${name}`](id);
      items.push(...chunk[key])
    }
    return items;
  }

  protected async getTeams() {
    const teams = await this.api.getTeams();
    return teams.teams;
  }

  protected async getSpaces() {
    if (!this.teamIds) {
      throw new Error('Team IDs not found');
    }
    return this.getItems('Spaces', this.teamIds, 'spaces');
  }

  protected async getFolders() {
    if (!this.spaceIds) {
      throw new Error('Space IDs not found');
    }
    return this.getItems('Folders', this.spaceIds, 'folders');
  }

  protected async getLists() {
    if (!this.folderIds) {
      throw new Error('Folder IDs not found');
    }
    return this.getItems('Lists', this.folderIds, 'lists');
  }

  protected async getFolderlessLists() {
    if (!this.spaceIds) {
      throw new Error('SpaceIDs not found');
    };
    return this.getItems('Folderless', this.spaceIds, 'lists');
  }

  protected getMembersFromTeams(teams: IClickUpTeam[]): IClickUpMember[] {
    const members = [];
    for (const team of teams) {
      for (const member of team.members) {
        members.push(member.user);
      }
    }
    return members;
  }

  protected async* getAllTasksIterator(listId: string): AsyncGenerator<IClickUpTaskResponse> {
    let lastPage = false;
    let currentPage = 0;
    do {
      try {
        const data: IClickUpTaskResponse = await this.api.getTasks(listId, {
          page: currentPage
        });
        yield data;
        lastPage = data.last_page;
        currentPage++;
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      } catch (e: any) {
        throw new Error(e.message);
      }
    } while (!lastPage)
  }

  protected async getTasksByListId(listId: string): Promise<IClickUpTask[]> {
    const iterator: AsyncGenerator<IClickUpTaskResponse> = this.getAllTasksIterator(listId);
    const records: IClickUpTask[] = [];

    for await (const nextChunk of iterator) {
      records.push(...nextChunk.tasks)
    }

    return records;
  }
}