import { WrikeApi } from './api';
import { WrikeService } from './service';
import { WrikeTransformer } from './transformer';
import { IWrikeConfig } from './types';

export function getWrikeService(): WrikeService {
  const { WRIKE_TOKEN, WRIKE_LIMIT } = process.env;

  if (!WRIKE_TOKEN) {
    throw new Error('Missing necessary environment variables');
  }

  const config: IWrikeConfig = {
    token: WRIKE_TOKEN,
    limit: Number(WRIKE_LIMIT),
  };

  const api: WrikeApi = new WrikeApi(config);
  const transformer: WrikeTransformer = new WrikeTransformer();
  return new WrikeService(api, transformer);
}
