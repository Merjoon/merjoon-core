import { TrelloApi } from './api';
import { TrelloService } from './service';
import { TrelloTransformer } from './transformer';
import { ITrelloConfig } from './types';

export function getTrelloService(): TrelloService {
  const { TRELLO_API_KEY, TRELLO_TOKEN, TRELLO_LIMIT } = process.env;
  if (!TRELLO_API_KEY || !TRELLO_TOKEN) {
    throw new Error('TRELLO_API_KEY and TRELLO_TOKEN must be defined');
  }
  const config: ITrelloConfig = {
    key: TRELLO_API_KEY,
    token: TRELLO_TOKEN,
    limit: Number(TRELLO_LIMIT) || 1000,
  };

  const api: TrelloApi = new TrelloApi(config);
  const transformer: TrelloTransformer = new TrelloTransformer();
  return new TrelloService(api, transformer);
}
