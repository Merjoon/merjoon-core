import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TrelloTransformer } from './transformer';
import { TrelloApi } from './api';
import { ITrelloBoard, ITrelloCard, ITrelloItem, ITrelloList, ITrelloMember } from './types';

export class TrelloService implements IMerjoonService {
  static mapIds(items: ITrelloItem[]) {
    return items.map((item) => item.id);
  }

  static getLists(boards: ITrelloBoard[]) {
    const lists: Record<string, ITrelloList> = {};
    for (const board of boards) {
      if (board.lists) {
        for (const list of board.lists) {
          lists[list.id] = list;
        }
      }
    }
    return lists;
  }

  protected boardIds?: string[];
  protected organizationIds?: string[];
  protected lists: Record<string, ITrelloList> = {};
  constructor(
    public readonly api: TrelloApi,
    public readonly transformer: TrelloTransformer,
  ) {}

  public async init() {
    await this.getOwnOrganizationIds();
    return;
  }

  public async getOwnOrganizationIds() {
    const organizations = await this.api.getOwnOrganizations();
    this.organizationIds = TrelloService.mapIds(organizations);
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    let boards: ITrelloBoard[] = [];
    if (!this.organizationIds) {
      throw new Error('No organizationIds found.');
    }
    for (const organizationId of this.organizationIds) {
      const boardsByOrganization = await this.api.getBoardsByOrganizationId(organizationId, {
        lists: 'all',
      });
      boards = boards.concat(boardsByOrganization);
    }
    this.boardIds = TrelloService.mapIds(boards);
    this.lists = TrelloService.getLists(boards);
    return this.transformer.transformProjects(boards);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    if (!this.organizationIds) {
      throw new Error('No organizationIds found.');
    }
    let members: ITrelloMember[] = [];
    for (const organizationId of this.organizationIds) {
      const organizationMembers = await this.api.getMembersByOrganizationId(organizationId);
      members = members.concat(organizationMembers);
    }
    return this.transformer.transformUsers(members);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.boardIds) {
      throw new Error('No boardIds found');
    }
    let cards: ITrelloCard[] = [];
    for (const boardId of this.boardIds) {
      const boardCards = await this.api.getAllCardsByBoardId(boardId);
      cards = cards.concat(boardCards);
    }
    for (const card of cards) {
      card.list = this.lists[card.idList];
    }
    return this.transformer.transformTasks(cards);
  }
}
