import { HiveApiV1 } from './api/api-v1';
import { HiveApiV2 } from './api/api-v2';
import { HiveTransformer } from './transformer';
import { HiveService } from './service';
import { IHive2Config, IHive1Config } from './types';

export function getHiveService(): HiveService {
  const { HIVE_API_KEY, HIVE_MAX_SOCKETS } = process.env;

  if (!HIVE_API_KEY) {
    throw new Error('Missing necessary environment variables');
  }

  const configV1: IHive1Config = {
    apiKey: HIVE_API_KEY,
  };

  const configV2: IHive2Config = {
    apiKey: HIVE_API_KEY,
    maxSockets: Number(HIVE_MAX_SOCKETS) || 10,
  };
  // TODO do not export, create interfaces for HiveApiV1 & HiveApiV2

  const api = {
    v1: new HiveApiV1(configV1),
    v2: new HiveApiV2(configV2),
  };
  const transformer: HiveTransformer = new HiveTransformer();
  return new HiveService(api, transformer);
}
