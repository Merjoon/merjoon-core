import {IShortcutConfig, IShortcutMember, IShortcutStory, IShortcutWorkflow} from './types';
import {HttpClient} from '../common/HttpClient';
import {IMerjoonApiConfig} from '../common/types';
import {SHORTCUT_PATHS} from './consts';
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
    let body = await this.getStories();
    let next: string | null = body.next;
    yield body.data;
    while(next){
      const nextPath = `${next.split('?')[1]}`;
      const queryParamsObject = querystring.parse(nextPath);
      body = await this.getNext(queryParamsObject);
      yield body.data;
      next = body.next;
    }
  }

  public async getAllStories():Promise<IShortcutStory[]> {
    const iterator = this.getAllStoriesIterator();
    let records: IShortcutStory[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    
    return records;
  }

  public  async getStories(){
    return this.sendGetRequest(`${SHORTCUT_PATHS.SEARCH}/${SHORTCUT_PATHS.STORIES}`, { query: 'is:story' });
  }
  public  async getNext(queryParamsObject:object):Promise<IShortcutStory[]>{
    return this.sendGetRequest(`${SHORTCUT_PATHS.SEARCH}/${SHORTCUT_PATHS.STORIES}`,queryParamsObject);
  }

  public  async getMembers():Promise<IShortcutMember[]>{
    return this.sendGetRequest(SHORTCUT_PATHS.MEMBERS);
  }

  public  async getWorkflows():Promise<IShortcutWorkflow[]>{
    return this.sendGetRequest(SHORTCUT_PATHS.WORKFLOWS);
  }
}