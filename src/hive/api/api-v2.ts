import { IHiveConfig, IHiveV2Response, IHiveAction, IHiveProject, } from '../types';
import { HIVE_PATHS } from '../consts';
import { BaseHiveApi } from './base-api';

export class HiveApiV2 extends BaseHiveApi {
  constructor(config: IHiveConfig) {
    super('https://app.hive.com/api/v2', config);
  }

  protected async* getAllItemsIterator(path: string, limit = 50): AsyncGenerator<IHiveV2Response> {
    let startCursor, hasNextPage;
    do {
      const data: IHiveV2Response = await this.sendGetRequest(path, {
        first: limit,
        after: startCursor,
      });
      yield data;
      hasNextPage = data.pageInfo.hasNextPage;
      startCursor = data.pageInfo.endCursor;
    } while (hasNextPage);
  }

  protected async getAllItems<T>(path: string): Promise<T[]> {
    const iterator = this.getAllItemsIterator(path);
    const records: T[] = [];

    for await (const nextChunk of iterator) {
      records.push(...nextChunk.edges.map(edge => edge.node));
    }

    return records;
  }

  public async getProjects(workspaceId: string) {
    return this.getAllItems<IHiveProject>(HIVE_PATHS.PROJECTS(workspaceId));
  }

  public async getActions(workspaceId: string) {
    return this.getAllItems<IHiveAction>(HIVE_PATHS.ACTIONS(workspaceId));
  }
}
