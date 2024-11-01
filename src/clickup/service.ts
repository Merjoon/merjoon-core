import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import {
  IClickUpMember,
  IClickUpList,
  IClickUpItem,
  IClickUpTeam,
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

  protected async getTeams() {
    return this.api.getTeams();
  }

  protected async getSpaces() {
    if (!this.teamIds) {
      throw new Error('Team IDs not found');
    }
    const items = await Promise.all(this.teamIds.map((id) => this.api.getTeamSpaces(id)));
    return items.flat();
  }

  protected async getFolders() {
    if (!this.spaceIds) {
      throw new Error('Space IDs not found');
    }
    const items = await Promise.all(this.spaceIds.map((id) => this.api.getSpaceFolders(id)));
    return items.flat();
  }

  protected async getLists() {
    if (!this.folderIds) {
      throw new Error('Folder IDs not found');
    }
    const items = await Promise.all(this.folderIds.map((id) => this.api.getFolderLists(id)));
    return items.flat();
  }

  protected async getFolderlessLists() {
    if (!this.spaceIds) {
      throw new Error('SpaceIDs not found');
    }
    const items = await Promise.all(this.spaceIds.map((id) => this.api.getSpaceLists(id)));
    return items.flat();
  }

  protected async getAllTasks() {
    if (!this.listIds) {
      throw new Error('List IDs not found');
    }
    const items = await Promise.all(this.listIds.map((id) => this.api.getListAllTasks(id)));
    return items.flat();
  }

  protected getMembersFromTeams(teams: IClickUpTeam[]): IClickUpMember[] {
    let members: IClickUpMember[] = [];
    for (const team of teams) {
      const teamMembers = team.members.map(m => m.user);
      members = members.concat(teamMembers);
    }
    return members;
  }

  protected async getAllLists(): Promise<IClickUpList[]> {
    const spaces = await this.getSpaces();
    this.spaceIds = ClickUpService.mapIds(spaces);
    const folders = await this.getFolders();
    this.folderIds = ClickUpService.mapIds(folders);
    let lists = await this.getLists();
    const folderlessLists = await this.getFolderlessLists();
    lists = lists.concat(folderlessLists);
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
    const lists = await this.getAllLists();
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