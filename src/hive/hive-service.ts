import { HiveApiV1 } from './api/api-v1';
import { HiveApiV2 } from './api/api-v2';
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

  const api = {
    v1: new HiveApiV1(config),
    v2: new HiveApiV2(config),
  };

  const transformer: HiveTransformer = new HiveTransformer();
  return new HiveService(api, transformer);
}
