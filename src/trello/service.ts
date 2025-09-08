import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TrelloTransformer } from './transformer';
import { TrelloApi } from './api';
import { ITrelloBoard, ITrelloCard, ITrelloItem, ITrelloList, ITrelloMember } from './types';
import { getUniqueItems } from '../verify/utils';

export class TrelloService implements IMerjoonService {
  protected static mapIds(items: ITrelloItem[]) {
    return items.map((item) => item.id);
  }

  protected static mapToLists(boards: ITrelloBoard[]) {
    const mappedLists = new Map<string, ITrelloList>();
    boards.map((board) => {
      if (board.lists) {
        board.lists.map((list) => {
          mappedLists.set(list.id, list);
        });
      }
    });
    return mappedLists;
  }

  static mapToBoardIdsAndLists(boards: ITrelloBoard[]) {
    const boardIds = TrelloService.mapIds(boards);
    const lists = TrelloService.mapToLists(boards);
    return {
      boardIds,
      lists,
    };
  }

  protected boardIds?: string[];
  protected organizationIds?: string[];
  protected lists?: Map<string, ITrelloList>;
  constructor(
    public readonly api: TrelloApi,
    public readonly transformer: TrelloTransformer,
  ) {}

  public async init() {
    await this.getOwnOrganizationIds();
  }

  protected async getOwnOrganizationIds() {
    const organizations = await this.api.getOwnOrganizations();
    this.organizationIds = TrelloService.mapIds(organizations);
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    if (!this.organizationIds) {
      throw new Error('No organizationIds found');
    }
    let boards: ITrelloBoard[] = [];
    for (const organizationId of this.organizationIds) {
      const boardsByOrganization = await this.api.getBoardsByOrganizationId(organizationId, {
        lists: 'all',
      });
      boards = boards.concat(boardsByOrganization);
    }
    const { boardIds, lists } = TrelloService.mapToBoardIdsAndLists(boards);
    this.boardIds = boardIds;
    this.lists = lists;
    return this.transformer.transformProjects(boards);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    if (!this.organizationIds) {
      throw new Error('No organizationIds found');
    }
    let allMembers: ITrelloMember[] = [];
    for (const organizationId of this.organizationIds) {
      const organizationMembers = await this.api.getMembersByOrganizationId(organizationId);
      allMembers = allMembers.concat(organizationMembers);
    }
    const members = getUniqueItems<ITrelloMember>(allMembers, ['id']);
    return this.transformer.transformUsers(members);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.boardIds || !this.lists) {
      throw new Error('No boardIds or lists found');
    }
    let cards: ITrelloCard[] = [];
    for (const boardId of this.boardIds) {
      const boardCards = await this.api.getAllCardsByBoardId(boardId);
      cards = cards.concat(boardCards);
    }
    for (const card of cards) {
      card.list = this.lists.get(card.idList);
    }
    return this.transformer.transformTasks(cards);
  }
}
