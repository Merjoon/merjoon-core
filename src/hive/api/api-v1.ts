import {
  IHiveConfig, IHiveUser, IHiveItem
} from '../types';
import {
  HIVE_PATHS
} from '../consts';
import {
  BaseHiveApi
} from './base-api';

export class HiveApiV1 extends BaseHiveApi {
  constructor(config: IHiveConfig) {
    super('https://app.hive.com/api/v1', config);
  }

  public async getWorkspaces(): Promise<IHiveItem[]> {
    return this.sendGetRequest(HIVE_PATHS.WORKSPACES);
  }

  public async getUsers(): Promise<IHiveUser[]> {
    return this.sendGetRequest(HIVE_PATHS.USERS);
  }
}
