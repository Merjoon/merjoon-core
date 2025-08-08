import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { TrelloTransformer } from './transformer';
import { TrelloApi } from './api';
import { ITrelloCard, ITrelloItem, ITrelloMember } from './types';

export class TrelloService implements IMerjoonService {
  static mapIds(items: ITrelloItem[]) {
    return items.map((item) => item.id);
  }
  protected boardIds?: string[];
  constructor(
    public readonly api: TrelloApi,
    public readonly transformer: TrelloTransformer,
  ) {}

  public async init() {
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    const projects = await this.api.getBoards();
    this.boardIds = TrelloService.mapIds(projects);

    return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    if (!this.boardIds) {
      throw new Error('boardIds not found');
    }
    let members: ITrelloMember[] = [];
    for (const boardId of this.boardIds) {
      const boardMembers = await this.api.getMembersByBoard(boardId);
      members = members.concat(boardMembers);
    }
    return this.transformer.transformUsers(members);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.boardIds) {
      throw new Error('boardIds not found');
    }
    let cards: ITrelloCard[] = [];
    for (const boardId of this.boardIds) {
      const boardCards = await this.api.getAllCardsByBoard(boardId);
      cards = cards.concat(boardCards);
    }
    for (const card of cards) {
      card.list = await this.api.getListByCard(card.id);
    }
    return this.transformer.transformTasks(cards);
  }
}
