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
    return Promise.all(this.teamIds.map((id) => this.api.getTeamSpaces(id)));
  }

  protected async getFolders() {
    if (!this.spaceIds) {
      throw new Error('Space IDs not found');
    }
    return Promise.all(this.spaceIds.map((id) => this.api.getSpaceFolders(id)));
  }

  protected async getLists() {
    if (!this.folderIds) {
      throw new Error('Folder IDs not found');
    }
    return Promise.all(this.folderIds.map((id) => this.api.getFolderLists(id)));
  }

  protected async getFolderlessLists() {
    if (!this.spaceIds) {
      throw new Error('SpaceIDs not found');
    }
    return Promise.all(this.spaceIds.map((id) => this.api.getSpaceLists(id)));
  }

  protected async getAllTasks() {
    if (!this.listIds) {
      throw new Error('List IDs not found');
    }
    return Promise.all(this.listIds.map((id) => this.api.getListAllTasks(id)));
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
    const spaces = (await this.getSpaces()).flat();
    this.spaceIds = ClickUpService.mapIds(spaces);
    const folders = (await this.getFolders()).flat();
    this.folderIds = ClickUpService.mapIds(folders);
    let lists = (await this.getLists()).flat();
    const folderlessLists = (await this.getFolderlessLists()).flat();
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
    const tasks = (await this.getAllTasks()).flat();
    return this.transformer.transformTasks(tasks);
  }
}