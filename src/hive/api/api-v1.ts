import { IHiveConfig } from '../types';
import { HIVE_PATHS } from '../consts';
import { BaseHiveApi } from './base-api';

export class HiveApiV1 extends BaseHiveApi {
  constructor(config: IHiveConfig) {
    super('https://app.hive.com/api/v1', config);
  }

  public async getWorkspaces() {
    return this.sendGetRequest(HIVE_PATHS.WORKSPACES);
  }

  public async getUsers() {
    return this.sendGetRequest(HIVE_PATHS.USERS);
  }
}
