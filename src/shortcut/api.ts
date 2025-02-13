import {
  IShortcutConfig,
  IShortcutStory,
  IShortcutMember, IShortcutStoryResponse, ShortcutApiPath, IShortcutQueryParams
} from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { SHORTCUT_PATHS } from './consts';

export class ShortcutApi extends HttpClient {
  constructor(protected config: IShortcutConfig) {
    const basePath = 'https://api.app.shortcut.com/api/v3/';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        'Shortcut-Token': `${config.token}`,
      }

    };
    super(apiConfig);
  }

  protected async sendGetRequest(path: ShortcutApiPath, queryParams?:IShortcutQueryParams) {
    return this.get({
      path,
      queryParams
    });
  }

  protected async* getAllStoriesIterator(){
    const path: ShortcutApiPath = SHORTCUT_PATHS.STORIES;
    let next: string | undefined = undefined;
    let data: IShortcutStoryResponse;
    do {
      const queryParams: IShortcutQueryParams = next
        ? { query: 'is:story', next }
        : { query: 'is:story' };
      data = await this.sendGetRequest(path, queryParams);
      yield data;
      const match = /[?&]next=([^&]+)/.exec(data.next);
      next = match ? match[1] : undefined;
    } while (data.next);
  }

  public async getAllStories() {
    const iterator = this.getAllStoriesIterator();
    let records: IShortcutStory[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk.data);
    }
    
    return records;
  }

  public  async getAllMembers(){
    const path = SHORTCUT_PATHS.MEMBERS;
    const response: IShortcutMember[] = await this.sendGetRequest(path);
    return response;
  }
}