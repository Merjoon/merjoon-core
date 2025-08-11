import { HttpClient } from '../common/HttpClient';
import {
  HttpMethod,
  IHttpRequestConfig,
  IMerjoonApiConfig,
  IResponseConfig,
} from '../common/types';
import {
  ITrelloMember,
  ITrelloBoard,
  ITrelloList,
  ITrelloCard,
  ITrelloConfig,
  ITrelloQueryParams,
  ITrelloItem,
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
  public async sendGetRequest<T>(path: string, queryParams?: ITrelloQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }

  protected async sendRequest<T, D>(
    method: HttpMethod,
    url: string,
    data?: D,
    config: IHttpRequestConfig = {},
  ): Promise<IResponseConfig<T>> {
    config.params = {
      key: this.config.key,
      token: this.config.token,
    };
    return super.sendRequest<T, D>(method, url, data, config);
  }

  protected async *getAllCardsIterator(boardId: string) {
    let before: string | undefined = undefined;
    let isLast = false;
    do {
      const queryParams: ITrelloQueryParams = {
        limit: this.limit,
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

  public getOrganizations() {
    return this.sendGetRequest<ITrelloItem[]>(TRELLO_PATHS.ORGANIZATIONS);
  }

  public getBoardsByOrganization(organizationId: string) {
    return this.sendGetRequest<ITrelloBoard[]>(TRELLO_PATHS.BOARDS(organizationId));
  }

  public getMembersByOrganization(OrganizationId: string) {
    return this.sendGetRequest<ITrelloMember[]>(TRELLO_PATHS.MEMBERS(OrganizationId));
  }

  public getCardsByBoard(boardId: string, params: ITrelloQueryParams) {
    return this.sendGetRequest<ITrelloCard[]>(TRELLO_PATHS.CARDS(boardId), params);
  }

  public getListsByBoard(boardId: string) {
    return this.sendGetRequest<ITrelloList[]>(TRELLO_PATHS.LISTS(boardId));
  }
}
