import { ClickUpApi } from './api';
import { ClickUpTransformer } from './transformer';
import { ClickUpService } from './service';
import { IClickUpConfig } from './types';

export function getClickUpService(): ClickUpService {
  const { CLICKUP_API_KEY, CLICKUP_MAX_SOCKETS, CLICKUP_MAX_RETRIES, CLICKUP_REQUEST_WAIT_TIME } =
    process.env;

  if (!CLICKUP_API_KEY) {
    throw new Error('Missing environment variable CLICKUP_API_KEY');
  }

  const config: IClickUpConfig = {
    apiKey: CLICKUP_API_KEY,
    maxSockets: Number(CLICKUP_MAX_SOCKETS) || 10,
    maxRetries: Number(CLICKUP_MAX_RETRIES) || 10,
    waitTime: Number(CLICKUP_REQUEST_WAIT_TIME) || 60000,
  };

  const api: ClickUpApi = new ClickUpApi(config);
  const transformer: ClickUpTransformer = new ClickUpTransformer();
  return new ClickUpService(api, transformer);
}
