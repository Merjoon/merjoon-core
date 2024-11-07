import { HiveApi } from './api';
import { HiveTransformer } from './transformer';
import { HiveService } from './service';
import { IHiveConfig } from './types';

export function getHiveService(): HiveService {
  const {
    HIVE_API_KEY,
  } = process.env;

  if (!HIVE_API_KEY) {
    throw new Error('Missing necessary environment variables');
  }

  const config: IHiveConfig = {
    apiKey: HIVE_API_KEY,
  };

  const api: HiveApi = new HiveApi(config);
  const transformer: HiveTransformer = new HiveTransformer();
  return new HiveService(api, transformer);
}
