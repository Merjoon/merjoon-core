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
      apiKey: apiKey,
      token: token,
    };
    api = new TrelloApi(config);
  });

  describe('get organizations', () => {
    it('Should fetch organizations', async () => {
      const organizations = await api.getOwnOrganizations();
      expect(organizations.length).toBeGreaterThan(0);

      expect(organizations[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });
  });

  describe('get boards,members,cards', () => {
    beforeEach(async () => {
      const organizations = await api.getOwnOrganizations();
      organizationId = organizations[0].id;
    });

    it('should fetch and parse boards correctly', async () => {
      const boards = await api.getBoardsByOrganizationId(organizationId);
      expect(boards.length).toBeGreaterThan(0);

      expect(boards[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          desc: expect.any(String),
          dateLastActivity: expect.any(String),
          lists: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
            }),
          ]),
        }),
      );
    });

    it('should fetch and parse board members correctly', async () => {
      const members = await api.getMembersByOrganizationId(organizationId);

      expect(members.length).toBeGreaterThan(0);
      expect(members[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          fullName: expect.any(String),
        }),
      );
    });

    it('should fetch and parse cards correctly', async () => {
      const boards = await api.getBoardsByOrganizationId(organizationId);
      boardId = boards[0].id;

      const getCardsSpy = jest.spyOn(api, 'getCardsByBoardId');
      const cards = await api.getAllCardsByBoardId(boardId);
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
});
