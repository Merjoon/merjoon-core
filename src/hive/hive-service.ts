import { HiveApiV1, HiveApiV2 } from './api';
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

  const apiV1: HiveApiV1 = new HiveApiV1(config);
  const apiV2: HiveApiV2 = new HiveApiV2(config);
  const transformer: HiveTransformer = new HiveTransformer();
  return new HiveService(apiV1, apiV2, transformer);
}
