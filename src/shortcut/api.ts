import {
  IShortcutConfig,
  IShortcutStory,
  IShortcutMember,
} from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { SHORTCUT_PATHS } from './consts';
import * as querystring from 'querystring';

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

  protected async sendGetRequest(path: string, queryParams?:object) {
    return this.get({
      path,
      queryParams
    });
  }

  protected async* getAllStoriesIterator(){
    const path = `${SHORTCUT_PATHS.SEARCH}/${SHORTCUT_PATHS.STORIES}`;
    let next: string | null ='';
    let body = await this.sendGetRequest(path, { query: 'is:story' });
    yield body.data;
    next=body.next;
    while(next){
      const queryParamsObject = querystring.parse(`${next.split('?')[1]}`);
      body = await this.sendGetRequest(path,queryParamsObject);
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

  public  async getAllMembers(){
    const path = SHORTCUT_PATHS.MEMBERS;
    const response: IShortcutMember[] = await this.sendGetRequest(path);
    return response;
  }
}