import { QuireService } from './service';
import { IQuireConfig } from './types';
import { QuireApi } from './api';
import { QuireTransformer } from './transformer';

export async function getQuireService(): Promise<QuireService> {
  const { QUIRE_REFRESH_TOKEN, QUIRE_CLIENT_ID, QUIRE_CLIENT_SECRET, QUIRE_MAX_SOCKETS } =
    process.env;
  if (!QUIRE_REFRESH_TOKEN || !QUIRE_CLIENT_ID || !QUIRE_CLIENT_SECRET) {
    throw new Error('Missing necessary environment variables');
  }
  const config: IQuireConfig = {
    refreshToken: QUIRE_REFRESH_TOKEN,
    clientId: QUIRE_CLIENT_ID,
    clientSecret: QUIRE_CLIENT_SECRET,
    maxSockets: Number(QUIRE_MAX_SOCKETS) || 5,
  };
  const api: QuireApi = new QuireApi(config);
  await api.init();
  const transformer: QuireTransformer = new QuireTransformer();
  return new QuireService(api, transformer);
}
