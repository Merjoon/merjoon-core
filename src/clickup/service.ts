import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { IClickUpMember, IClickUpTask, IClickUpList, IClickUpTaskResponse, IClickUpItem, IClickUpTeam } from './types';
import { ClickUpTransformer } from './transformer';
import { ClickUpApi } from './api';

export class ClickUpService implements IMerjoonService {

  protected teamIds: string[] | undefined;
  protected spaceIds: string[] | undefined;
  protected folderIds: string[] | undefined;
  protected listIds: string[] | undefined;
  
  constructor(public readonly api: ClickUpApi, public readonly transformer: ClickUpTransformer) {
  }

  static mapIds(items: IClickUpItem[]) {
    return items.map((item: IClickUpItem) => item.id);
  }

  protected getApiMethod(name: string) {
    const config = {
      teams: this.api.getTeams,
      spaces: this.api.getTeamSpaces,
      folders: this.api.getSpaceFolders,
      lists: this.api.getFolderLists,
      folderlessLists: this.api.getSpaceLists,
      tasks: this.api.getListAllTasks,
    }
    return config[name];
  }

  protected async getItems<T>(name: string, ids: string[]) {
    const items: T[] = [];
    for (const id of ids) {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      const chunk = await (this.api as any)[`get${name}`](id);
      items.push(...chunk)
    }
    return items;
  }


  protected async getTeams() {
    const teams = await this.api.getTeams();
    return teams;
  }

  protected async getSpaces() {
    if (!this.teamIds) {
      throw new Error('Team IDs not found');
    }
    return this.getItems<IClickUpItem>('Spaces', this.teamIds, 'spaces');
  }

  protected async getFolders() {
    if (!this.spaceIds) {
      throw new Error('Space IDs not found');
    }
    return this.getItems<IClickUpItem>('Folders', this.spaceIds, 'folders');
  }

  protected async getLists() {
    if (!this.folderIds) {
      throw new Error('Folder IDs not found');
    }
    return this.getItems<IClickUpList>('Lists', this.folderIds, 'lists');
  }

  protected async getFolderlessLists() {
    if (!this.spaceIds) {
      throw new Error('SpaceIDs not found');
    }
    return this.getItems<IClickUpList>('Folderless', this.spaceIds, 'lists');
  }

  protected async getAllTasks(listId) {
    if (!this.listIds) {
      throw new Error('List IDs not found');
    }
    return this.getItems<IClickUpTask>()
  }

  protected getMembersFromTeams(teams: IClickUpTeam[]): IClickUpMember[] {
    let members: IClickUpMember[] = [];
    for (const team of teams) {
      const teamMembers = team.members.map(m => m.user);
      members = members.concat(teamMembers)
    }
    return members;
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const teams = await this.getTeams();
    this.teamIds = ClickUpService.mapIds(teams);
    const members = this.getMembersFromTeams(teams);
    return this.transformer.transformMembers(members);
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    if (!this.teamIds) {
      throw new Error('Space IDs not found');
    }
    const spaces = await this.getSpaces();
    this.spaceIds = ClickUpService.mapIds(spaces);
    const folders = await this.getFolders();
    this.folderIds = ClickUpService.mapIds(folders);
    const lists = await this.getLists();
    const folderlessLists = await this.getFolderlessLists();
    lists.push(...folderlessLists);
    this.listIds = ClickUpService.mapIds(lists);
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
}