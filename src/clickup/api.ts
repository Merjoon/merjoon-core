import { IClickUpConfig, ClickUpApiPath, ClickUpSubdomain, IClickUpTokenConfig} from './types';
import { HttpClient } from '../common/HttpClient';
import { IRequestConfig } from '../common/types';

export class HiveApi extends HttpClient {

  protected readonly api_key: string;
  protected readonly team_id: string;
  protected tokens: IClickUpTokenConfig;

  constructor(protected config: IClickUpConfig) {
    const basePath = `https://api.clickup.com/api/v2`;
    super(basePath);
    this.api_key = config.api_key;
    this.team_id = config.team_id;
    this.tokens = {
      space_ids: [],
      folder_ids: [],
      list_ids: [],
    }
  }

  protected async getTokens(token_name: keyof IClickUpTokenConfig) {
    let token_arr = this.tokens[token_name];
    if (token_arr.length === 0) {
        
    }
  }

  public async sendGetRequest(path: ClickUpApiPath) {
    const subdomain = ClickUpSubdomain[path];
    const token_name = subdomain + '_ids';
    const tokens = await this.getTokens(subdomain);
    let responses = [];
    //for token in tokens:
      //whole_path = `/${subdomain}/${token}/${path}
    const config: IRequestConfig = {
      headers: {
        Authorization: `${this.api_key}`
      }
    }

    const response = await this.get({
      path,
      config,
    })
    // responses.push(response
    return response?response:{};
  }
}