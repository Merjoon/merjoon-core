import { HeightApi } from './api';
import { HeightService } from './service';
import { HeightTransformer } from './transformer';
import { IHeightConfig } from './types';

export function getHeightService(): HeightService {
  const { HEIGHT_API_KEY, HEIGHT_LIMIT, HEIGHT_MAX_SOCKETS } = process.env;
  if (!HEIGHT_API_KEY) {
    throw new Error('Missing necessary environment variables');
  }
  const config: IHeightConfig = {
    apiKey: HEIGHT_API_KEY,
    limit: Number(HEIGHT_LIMIT),
    maxSockets: Number(HEIGHT_MAX_SOCKETS) || 10,
  };

  const api: HeightApi = new HeightApi(config);
  const transformer = new HeightTransformer();

  return new HeightService(api, transformer);
}
