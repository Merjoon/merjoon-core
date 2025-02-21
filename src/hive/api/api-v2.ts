import {
  IHiveConfig, IHiveV2Response, IHiveAction, IHiveProject
} from '../types';
import {
  HIVE_PATHS
} from '../consts';
import {
  BaseHiveApi
} from './base-api';

export class HiveApiV2 extends BaseHiveApi {
  constructor(config: IHiveConfig) {
    super('https://app.hive.com/api/v2', config);
  }

  protected async* getAllItemsIterator<T>(path: string, limit = 50): AsyncGenerator<IHiveV2Response<T>> {
    let startCursor, hasNextPage;
    do {
      const data: IHiveV2Response<T> = await this.sendGetRequest(path, {
        first: limit,
        after: startCursor,
      });
      yield data;
      hasNextPage = data.pageInfo.hasNextPage;
      startCursor = data.pageInfo.endCursor;
    } while (hasNextPage);
  }

  protected async getAllItems<T>(path: string): Promise<T[]> {
    const iterator = this.getAllItemsIterator<T>(path);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      const nodes: T[] = nextChunk.edges.map(edge => edge.node);
      records = records.concat(nodes);
    }

    return records;
  }

  public async getWorkspaceProjects(workspaceId: string): Promise<IHiveProject[]> {
    return this.getAllItems<IHiveProject>(HIVE_PATHS.PROJECTS(workspaceId));
  }

  public async getWorkspaceActions(workspaceId: string): Promise<IHiveAction[]> {
    return this.getAllItems<IHiveAction>(HIVE_PATHS.ACTIONS(workspaceId));
  }
}
