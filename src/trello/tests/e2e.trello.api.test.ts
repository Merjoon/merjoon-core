import { TrelloApi } from '../api';
import { ITrelloConfig, ITrelloQueryParams } from '../types';

const token = process.env.TRELLO_TOKEN;
const apiKey = process.env.TRELLO_API_KEY;
if (!token || !apiKey) {
  throw new Error('Missing environment variables');
}

describe('Trello API', () => {
  let api: TrelloApi;
  let config: ITrelloConfig;
  let boardId: string;
  let params: ITrelloQueryParams;
  beforeAll(() => {
    config = {
      limit: 7,
    };
    api = new TrelloApi(config);
    params = {
      key: apiKey,
      token: token,
      limit: config.limit,
    };
  });

  beforeEach(async () => {
    const boards = await api.getBoards(params);
    boardId = boards[0].id;
  });

  describe('get boards', () => {
    it('should fetch boards', async () => {
      const projects = await api.getBoards(params);

      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          desc: expect.any(String),
          dateLastActivity: expect.any(String),
        }),
      );
    });
  });

  describe('get members by board', () => {
    it('should fetch and parse board members correctly', async () => {
      const members = await api.getMembersByBoard(boardId, params);

      expect(members.length).toBeGreaterThan(0);
      expect(members[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          fullName: expect.any(String),
        }),
      );
    });
  });

  describe('get cards pagination by board', () => {
    it('should fetch and parse cards correctly', async () => {
      const getCardsSpy = jest.spyOn(api, 'getCardsByBoard');
      const cards = await api.getAllCardsByBoard(boardId, params);
      const cardCount = cards.length;
      const expectedCallCount = cardCount % api.limit;
      let totalPagesCalledCount = Math.ceil(cardCount / config.limit);
      if (expectedCallCount === 0) {
        totalPagesCalledCount += 1;
      }

      expect(cards.length).toBeGreaterThan(0);
      expect(cards[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          idMembers: expect.arrayContaining([expect.any(String)]),
          desc: expect.any(String),
          dateLastActivity: expect.any(String),
          url: expect.any(String),
        }),
      );
      expect(getCardsSpy).toBeCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
    });
  });
  describe('get lists by card', () => {
    it('should fetch and parse card list correctly', async () => {
      const cards = await api.getCardsByBoard(boardId, params);
      const cardId = cards[0].id;
      const list = await api.getListByCard(cardId, params);
      expect(list).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      );
    });
  });
});
