import { QuireApi } from './api';
import { IQuireConfig } from './types';

const QUIRE_TOKEN = process.env.QUIRE_TOKEN;
const QUIRE_LIMIT = process.env.QUIRE_LIMIT;

if (!QUIRE_TOKEN) {
  throw new Error('Missing necessary environment variables: QUIRE_TOKEN');
}

const config: IQuireConfig = {
  token: QUIRE_TOKEN,
  limit: Number(QUIRE_LIMIT) || 100,
};

const api: QuireApi = new QuireApi(config);
// eslint-disable-next-line no-console
console.log(api.getAllProjects());
