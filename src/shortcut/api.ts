import * as querystring from 'querystring';
import {
  IShortcutStoriesResponse,
  IShortcutConfig,
  IShortcutMember,
  IShortcutStory,
  IShortcutWorkflow,
} from './types';
import { HttpClient } from '../common/HttpClient';
import { IBaseQueryParams, IMerjoonApiConfig } from '../common/types';
import { SHORTCUT_PATHS } from './consts';

export class ShortcutApi extends HttpClient {
  public readonly limit: number;
  constructor(protected config: IShortcutConfig) {
    const basePath = 'https://api.app.shortcut.com/api/v3/';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'Shortcut-Token': `${config.token}`,
      },
    };
    super(apiConfig);
    this.limit = config.limit || 25;
  }

  protected async sendGetRequest<T>(path: string, queryParams?: IBaseQueryParams) {
    const response = await this.get<T>({
      path,
      queryParams,
    });

    return response.data;
  }

  protected async *getAllStoriesIterator() {
    let body = await this.getStories({ page_size: this.limit });
    let next: string | null = body.next;

    yield body.data;
    while (next) {
      body = await this.getNext(next);
      yield body.data;
      next = body.next;
    }
  }

  public async getAllStories() {
    const iterator = this.getAllStoriesIterator();
    let records: IShortcutStory[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  public async getStories(queryParamsObject: IBaseQueryParams) {
    const queryParams = { ...queryParamsObject, query: 'is:story' };
    return this.sendGetRequest<IShortcutStoriesResponse>(
      `${SHORTCUT_PATHS.SEARCH}/${SHORTCUT_PATHS.STORIES}`,
      queryParams,
    );
  }
  public async getNext(nextUrl: string) {
    const nextPath = `${nextUrl.split('?')[1]}`;
    const queryParamsObject = querystring.parse(nextPath);
    const queryParams = { ...queryParamsObject, page_size: this.limit };
    return this.sendGetRequest<IShortcutStoriesResponse>(
      `${SHORTCUT_PATHS.SEARCH}/${SHORTCUT_PATHS.STORIES}`,
      queryParams,
    );
  }

  public async getMembers(): Promise<IShortcutMember[]> {
    return this.sendGetRequest<IShortcutMember[]>(SHORTCUT_PATHS.MEMBERS);
  }

  public async getWorkflows(): Promise<IShortcutWorkflow[]> {
    return this.sendGetRequest<IShortcutWorkflow[]>(SHORTCUT_PATHS.WORKFLOWS);
  }
}
