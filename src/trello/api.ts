import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import {
  ITrelloMember,
  ITrelloBoard,
  ITrelloList,
  ITrelloCard,
  ITrelloConfig,
  ITrelloQueryParams,
} from './types';
import { TRELLO_PATHS } from './consts';

export class TrelloApi extends HttpClient {
  public readonly limit: number;
  public readonly params: ITrelloQueryParams;
  constructor(protected config: ITrelloConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://api.trello.com/1',
    };
    super(apiConfig);
    this.limit = config.limit || 1000;
    this.params = config;
  }
  public async sendGetRequest<T>(path: string, queryParams: ITrelloQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }

  protected async *getAllCardsIterator(boardId: string) {
    let before: string | undefined = undefined;
    let isLast = false;
    do {
      const queryParams: ITrelloQueryParams = {
        ...this.params,
        before,
      };
      const cards: ITrelloCard[] = await this.getCardsByBoard(boardId, queryParams);
      yield cards;
      isLast = cards.length < this.limit;
      if (cards.length) {
        before = cards[0].id;
      }
    } while (!isLast);
  }

  public async getAllCardsByBoard(boardId: string) {
    const iterator = this.getAllCardsIterator(boardId);
    let cards: ITrelloCard[] = [];

    for await (const nextChunk of iterator) {
      cards = cards.concat(nextChunk);
    }
    return cards;
  }
  public getBoards() {
    return this.sendGetRequest<ITrelloBoard[]>(TRELLO_PATHS.BOARDS, this.params);
  }
  public getMembersByBoard(boardId: string) {
    return this.sendGetRequest<ITrelloMember[]>(TRELLO_PATHS.MEMBERS(boardId), this.params);
  }
  public getCardsByBoard(boardId: string, params: ITrelloQueryParams) {
    return this.sendGetRequest<ITrelloCard[]>(TRELLO_PATHS.CARDS(boardId), params);
  }
  public getListByCard(cardId: string) {
    return this.sendGetRequest<ITrelloList>(TRELLO_PATHS.LIST(cardId), this.params);
  }
}
