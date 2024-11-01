import { ClickUpApi } from './api';
import { ClickUpTransformer } from './transformer';
import { ClickUpService } from './service';
import { IClickUpConfig} from './types';

export function getClickUpService(): ClickUpService {
  const {
    CLICKUP_API_KEY,
    CLICKUP_HTTP_AGENT_MAX_SOCKETS: CLICKUP_HTTPS_AGENT_MAX_SOCKETS,
  } = process.env;

  if (!CLICKUP_API_KEY) {
    throw new Error('Missing necessary environment variables');
  }

  const config: IClickUpConfig = {
    apiKey: CLICKUP_API_KEY,
  };

  if (CLICKUP_HTTPS_AGENT_MAX_SOCKETS) {
    config.httpsAgent = {
      maxSockets: Number(CLICKUP_HTTPS_AGENT_MAX_SOCKETS),
    };
  }

  const api: ClickUpApi = new ClickUpApi(config);
  const transformer: ClickUpTransformer = new ClickUpTransformer();
  return new ClickUpService(api, transformer);
}