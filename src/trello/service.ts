import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TrelloTransformer } from './transformer';
import { TrelloApi } from './api';
import { ITrelloBoard, ITrelloCard, ITrelloItem, ITrelloMember } from './types';

export class TrelloService implements IMerjoonService {
  static mapIds(items: ITrelloItem[]) {
    return items.map((item) => item.id);
  }
  protected boardIds?: string[];
  protected organizationIds?: string[];
  constructor(
    public readonly api: TrelloApi,
    public readonly transformer: TrelloTransformer,
  ) {}

  public async init() {
    const organizations = await this.api.getOrganizations();
    this.organizationIds = TrelloService.mapIds(organizations);
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    let boards: ITrelloBoard[] = [];
    if (!this.organizationIds) {
      throw new Error('No organization Ids found.');
    }
    for (const organizationId of this.organizationIds) {
      const boardsByOrganization = await this.api.getBoardsByOrganization(organizationId);
      boards = boards.concat(boardsByOrganization);
    }
    this.boardIds = TrelloService.mapIds(boards);

    return this.transformer.transformProjects(boards);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    if (!this.organizationIds) {
      throw new Error('No organization Ids found.');
    }
    let members: ITrelloMember[] = [];
    for (const organizationId of this.organizationIds) {
      const organizationMembers = await this.api.getMembersByOrganization(organizationId);
      members = members.concat(organizationMembers);
    }
    return this.transformer.transformUsers(members);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.boardIds) {
      throw new Error('boardIds not found');
    }
    let cards: ITrelloCard[] = [];
    for (const boardId of this.boardIds) {
      //const lists = await this.api.getListsByBoard(boardId);
      const boardCards = await this.api.getAllCardsByBoard(boardId);
      // boardCards.map((boardCard: ITrelloCard) => {
      //   lists.forEach((list: ITrelloList) => {
      //     if (boardCard.idList === list.id) {
      //       boardCard.list = list;
      //     }
      //   });
      // });
      cards = cards.concat(boardCards);
    }
    return this.transformer.transformTasks(cards);
  }
}
