import { WrikeApi} from './api';
import { WrikeService} from './service';
import { WrikeTransformer } from './transformer';
import {IWrikeConfig} from './types';

export function getWrikeService (): WrikeService {
  const {
    WRIKE_TOKEN,
    WRIKE_USE_HTTP_AGENT,
    WRIKE_HTTPS_AGENT_MAX_SOCKETS,
  } = process.env;

  if (!WRIKE_TOKEN) {
    throw new Error('Missing necessary environment variables');
  }

  const config: IWrikeConfig = {
    token: WRIKE_TOKEN,
  };

  if (WRIKE_USE_HTTP_AGENT === 'true') {
    config.httpsAgent = {
      maxSockets: WRIKE_HTTPS_AGENT_MAX_SOCKETS ? Number(WRIKE_HTTPS_AGENT_MAX_SOCKETS) : undefined,
    };
  }
  const api: WrikeApi = new WrikeApi(config);
  const transformer: WrikeTransformer = new WrikeTransformer();
  return new WrikeService(api, transformer);
}
