import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import {
  IClickUpMember,
  IClickUpTask,
  IClickUpList,
  IClickUpItem,
  IClickUpTeam,
  ApiMethods
} from './types';
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

  protected getApiMethod<K extends keyof ApiMethods>(name: K): ApiMethods[K] {
    const config: ApiMethods = {
      spaces: this.api.getTeamSpaces.bind(this.api),
      folders: this.api.getSpaceFolders.bind(this.api),
      lists: this.api.getFolderLists.bind(this.api),
      folderlessLists: this.api.getSpaceLists.bind(this.api),
      tasks: this.api.getListAllTasks.bind(this.api),
    }
    return config[name];
  }

  protected async getItems(name: keyof ApiMethods, ids: string[]) {
    const items: any[] = [];
    const method = this.getApiMethod(name)
    for (const id of ids) {
      const chunk = await method(id);
      items.push(...chunk);
    }
    return items;
  }

  protected async getTeams() {
    return this.api.getTeams();
  }

  protected async getSpaces() {
    if (!this.teamIds) {
      throw new Error('Team IDs not found');
    }
    return this.getItems('spaces', this.teamIds);
  }

  protected async getFolders() {
    if (!this.spaceIds) {
      throw new Error('Space IDs not found');
    }
    return this.getItems('folders', this.spaceIds);
  }

  protected async getLists() {
    if (!this.folderIds) {
      throw new Error('Folder IDs not found');
    }
    return this.getItems('lists', this.folderIds);
  }

  protected async getFolderlessLists() {
    if (!this.spaceIds) {
      throw new Error('SpaceIDs not found');
    }
    return this.getItems('folderlessLists', this.spaceIds);
  }

  protected async getAllTasks() {
    if (!this.listIds) {
      throw new Error('List IDs not found');
    }
    return this.getItems('tasks', this.listIds);
  }

  protected getMembersFromTeams(teams: IClickUpTeam[]): IClickUpMember[] {
    let members: IClickUpMember[] = [];
    for (const team of teams) {
      const teamMembers = team.members.map(m => m.user);
      members = members.concat(teamMembers)
    }
    return members;
  }

  protected async getAllLists(): Promise<IClickUpList[]> {
    const spaces = await this.getSpaces();
    this.spaceIds = ClickUpService.mapIds(spaces);
    const folders = await this.getFolders();
    this.folderIds = ClickUpService.mapIds(folders);
    const lists = await this.getLists();
    const folderlessLists = await this.getFolderlessLists();
    lists.push(...folderlessLists);
    return lists;
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const teams = await this.getTeams();
    this.teamIds = ClickUpService.mapIds(teams);
    const members = this.getMembersFromTeams(teams);
    return this.transformer.transformMembers(members);
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    if (!this.teamIds) {
      throw new Error('Team IDs not found');
    }
    const lists = await this.getAllLists()
    this.listIds = ClickUpService.mapIds(lists);
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