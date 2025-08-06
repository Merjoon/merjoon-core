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
  constructor(protected config: ITrelloConfig) {
    const apiConfig: IMerjoonApiConfig = {
      baseURL: 'https://api.trello.com/1',
    };
    super(apiConfig);
    this.limit = config.limit || 1000;
  }
  public async sendGetRequest<T>(path: string, queryParams: ITrelloQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }

  protected async *getAllCardsIterator(boardId: string, params: ITrelloQueryParams) {
    let before: string | undefined = undefined;
    let isLast = false;
    do {
      const queryParams: ITrelloQueryParams = {
        ...params,
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

  public async getAllCardsByBoard(boardId: string, params: ITrelloQueryParams) {
    const iterator = this.getAllCardsIterator(boardId, params);
    let cards: ITrelloCard[] = [];

    for await (const nextChunk of iterator) {
      cards = cards.concat(nextChunk);
    }
    return cards;
  }
  public getBoards(params: ITrelloQueryParams) {
    return this.sendGetRequest<ITrelloBoard[]>(TRELLO_PATHS.BOARDS, params);
  }
  public getMembersByBoard(boardId: string, params: ITrelloQueryParams) {
    return this.sendGetRequest<ITrelloMember[]>(TRELLO_PATHS.MEMBERS(boardId), params);
  }
  public getCardsByBoard(boardId: string, params: ITrelloQueryParams) {
    return this.sendGetRequest<ITrelloCard[]>(TRELLO_PATHS.CARDS(boardId), params);
  }
  public getListByCard(cardId: string, params: ITrelloQueryParams) {
    return this.sendGetRequest<ITrelloList>(TRELLO_PATHS.LIST(cardId), params);
  }
}
