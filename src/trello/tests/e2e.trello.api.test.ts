import { TrelloApi } from '../api';
import { ITrelloConfig } from '../types';

const token = process.env.TRELLO_TOKEN;
const apiKey = process.env.TRELLO_API_KEY;
if (!token || !apiKey) {
  throw new Error('Missing environment variables');
}

describe('Trello API', () => {
  let api: TrelloApi;
  let config: ITrelloConfig;
  let boardId: string;
  let organizationId: string;
  beforeAll(() => {
    config = {
      limit: 7,
      key: apiKey,
      token: token,
    };
    api = new TrelloApi(config);
  });

  beforeEach(async () => {
    const organizations = await api.getOrganizations();
    organizationId = organizations[0].id;

    const boards = await api.getBoardsByOrganization(organizationId);
    boardId = boards[0].id;
  });

  describe('get organizations', () => {
    return it('Should fetch organizations', async () => {
      const organizations = await api.getOrganizations();
      expect(organizations.length).toBeGreaterThan(0);

      expect(organizations[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });
  });

  describe('get boards by organizations', () => {
    it('should fetch and parse boards correctly', async () => {
      const boards = await api.getBoardsByOrganization(organizationId);
      expect(boards.length).toBeGreaterThan(0);

      expect(boards[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          desc: expect.any(String),
          dateLastActivity: expect.any(String),
        }),
      );
    });
  });

  describe('get members by organization', () => {
    it('should fetch and parse board members correctly', async () => {
      const members = await api.getMembersByOrganization(organizationId);

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
      const cards = await api.getAllCardsByBoard(boardId);
      const cardCount = cards.length;
      const expectedCallCount = cardCount % api.limit;
      let totalPagesCalledCount = Math.ceil(cardCount / api.limit);
      if (expectedCallCount === 0) {
        totalPagesCalledCount += 1;
      }

      expect(cards.length).toBeGreaterThan(0);
      expect(cards[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          idMembers: expect.arrayContaining([expect.any(String)]),
          idList: expect.any(String),
          desc: expect.any(String),
          dateLastActivity: expect.any(String),
          url: expect.any(String),
        }),
      );
      expect(getCardsSpy).toBeCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
    });
  });

  describe('get lists by board', () => {
    it('should fetch and parse card list correctly', async () => {
      const lists = await api.getListsByBoard(boardId);

      expect(lists[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      );
    });
  });
});
