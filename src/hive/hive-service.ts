import { HiveApiV1 } from './api/api-v1';
import { HiveApiV2 } from './api/api-v2';
import { HiveTransformer } from './transformer';
import { HiveService } from './service';
import { IHiveConfig } from './types';

export function getHiveService(): HiveService {
  const { HIVE_API_KEY, HIVE_USE_HTTP_AGENT, HIVE_HTTPS_AGENT_MAX_SOCKETS } = process.env;

  if (!HIVE_API_KEY) {
    throw new Error('Missing necessary environment variables');
  }

  const configV1: IHiveConfig = {
    apiKey: HIVE_API_KEY,
  };

  const configV2: IHiveConfig = {
    apiKey: HIVE_API_KEY,
  };

  if (HIVE_USE_HTTP_AGENT === 'true') {
    configV2.maxSockets = Number(HIVE_HTTPS_AGENT_MAX_SOCKETS);
  }

  const api = {
    v1: new HiveApiV1(configV1),
    v2: new HiveApiV2(configV2),
  };

  const transformer: HiveTransformer = new HiveTransformer();
  return new HiveService(api, transformer);
}
