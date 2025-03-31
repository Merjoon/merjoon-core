import { ClickUpApi } from './api';
import { ClickUpTransformer } from './transformer';
import { ClickUpService } from './service';
import { IClickUpConfig } from './types';

export function getClickUpService(): ClickUpService {
  const { CLICKUP_API_KEY, CLICKUP_MAX_SOCKETS, CLICKUP_LIMIT } = process.env;

  if (!CLICKUP_API_KEY) {
    throw new Error('Missing environment variable CLICKUP_API_KEY');
  }

  const config: IClickUpConfig = {
    apiKey: CLICKUP_API_KEY,
    maxSockets: Number(CLICKUP_MAX_SOCKETS) || 10,
    limit: Number(CLICKUP_LIMIT),
  };

  const api: ClickUpApi = new ClickUpApi(config);
  const transformer: ClickUpTransformer = new ClickUpTransformer();
  return new ClickUpService(api, transformer);
}
