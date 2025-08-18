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
      ...config.params,
      key: this.config.apiKey,
      token: this.config.token,
    };
    return super.sendRequest<T, D>(method, url, data, config);
  }

  protected async *getAllCardsIterator(boardId: string) {
    let before: string | undefined = undefined;
    const getCreatedTime = (id: string): number => {
      return parseInt(id.substring(0, 8), 16) * 1000;
    };
    do {
      const queryParams: ITrelloQueryParams = {
        limit: this.limit,
        before,
      };
      const cards: ITrelloCard[] = await this.getCardsByBoardId(boardId, queryParams);
      if (!cards.length) {
        return;
      }
      cards.sort((a, b) => getCreatedTime(a.id) - getCreatedTime(b.id));
      yield cards;
      if (cards.length === this.limit) {
        before = cards[0].id;
      } else {
        before = undefined;
      }
    } while (before);
  }

  public async getAllCardsByBoardId(boardId: string) {
    const iterator = this.getAllCardsIterator(boardId);
    let cards: ITrelloCard[] = [];

    for await (const nextChunk of iterator) {
      cards = cards.concat(nextChunk);
    }
    return cards;
  }

  public getOwnOrganizations() {
    return this.sendGetRequest<ITrelloItem[]>(TRELLO_PATHS.ORGANIZATIONS);
  }

  public getBoardsByOrganizationId(organizationId: string) {
    const params: ITrelloQueryParams = {
      lists: 'all',
    };
    return this.sendGetRequest<ITrelloBoard[]>(TRELLO_PATHS.BOARDS(organizationId), params);
  }

  public getMembersByOrganizationId(organizationId: string) {
    return this.sendGetRequest<ITrelloMember[]>(TRELLO_PATHS.MEMBERS(organizationId));
  }

  public getCardsByBoardId(boardId: string, params: ITrelloQueryParams) {
    return this.sendGetRequest<ITrelloCard[]>(TRELLO_PATHS.CARDS(boardId), params);
  }
}
