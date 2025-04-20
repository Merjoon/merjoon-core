import { MeisterApi } from './api';
import { MeisterService } from './service';
import { MeisterTransformer } from './transformer';
import { IMeisterConfig } from './type';

export function getMeisterService(): MeisterService {
  const { MEISTER_TOKEN, MEISTER_LIMIT } = process.env;
  if (!MEISTER_TOKEN) {
    throw new Error('Missing necessary environment variables');
  }
  const config: IMeisterConfig = {
    token: MEISTER_TOKEN,
    limit: Number(MEISTER_LIMIT),
  };
  const api: MeisterApi = new MeisterApi(config);
  const transformer: MeisterTransformer = new MeisterTransformer();
  return new MeisterService(api, transformer);
}
