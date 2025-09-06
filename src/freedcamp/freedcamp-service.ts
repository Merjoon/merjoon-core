import { FreedcampApi } from './api';
import { FreedcampService } from './service';
import { FreedcampTransformer } from './transformer';
import { IFreedcampConfig } from './types';

export function getFreedcampService() {
  const { FREEDCAMP_API_KEY, FREEDCAMP_API_SECRET, FREEDCAMP_LIMIT, FREEDCAMP_MAX_SOCKETS } =
    process.env;

  if (!FREEDCAMP_API_KEY || !FREEDCAMP_API_SECRET) {
    throw new Error('Missing necessary environment variables');
  }
  const config: IFreedcampConfig = {
    apiKey: FREEDCAMP_API_KEY,
    apiSecret: FREEDCAMP_API_SECRET,
    maxSockets: Number(FREEDCAMP_MAX_SOCKETS) || 10,
    limit: Number(FREEDCAMP_LIMIT),
  };
  const api: FreedcampApi = new FreedcampApi(config);
  const transformer: FreedcampTransformer = new FreedcampTransformer();
  return new FreedcampService(api, transformer);
}
