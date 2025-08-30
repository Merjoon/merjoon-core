import { TrelloApi } from '../api';
import { ITrelloConfig } from '../types';

const token = process.env.TRELLO_TOKEN;
const apiKey = process.env.TRELLO_API_KEY;
if (!token) {
  throw new Error('Trello token is not set in the environment variables');
}
if (!apiKey) {
  throw new Error('Trello apiKey is not set in the environment variables');
}

describe('Trello API', () => {
  let api: TrelloApi;
  let config: ITrelloConfig;

  beforeAll(() => {
    config = {
      apiKey: apiKey,
      token: token,
      limit: 7,
    };
    api = new TrelloApi(config);
  });

  describe('get own organizations', () => {
    it('should fetch organizations', async () => {
      const organizations = await api.getOwnOrganizations();
      expect(organizations.length).toBeGreaterThan(0);

      expect(organizations[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });
  });

  describe('get items by organization id', () => {
    let organizationId: string;
    beforeEach(async () => {
      const organizations = await api.getOwnOrganizations();
      organizationId = organizations[0].id;
    });

    describe('get boards by organization id', () => {
      it('should fetch and parse boards correctly (without lists)', async () => {
        const boards = await api.getBoardsByOrganizationId(organizationId);
        const board = boards[0];
        expect(boards.length).toBeGreaterThan(0);

        expect(board).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            desc: expect.any(String),
          }),
        );
        expect(board.lists).toBeUndefined();
      });

      it('should fetch and parse boards correctly (with lists)', async () => {
        const boards = await api.getBoardsByOrganizationId(organizationId, {
          lists: 'all',
        });
        expect(boards.length).toBeGreaterThan(0);

        expect(boards[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            desc: expect.any(String),
            lists: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: expect.any(String),
              }),
            ]),
          }),
        );
      });
    });

    describe('get members by organization id', () => {
      it('should fetch and parse organization members correctly', async () => {
        const members = await api.getMembersByOrganizationId(organizationId);

        expect(members.length).toBeGreaterThan(0);
        expect(members[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            fullName: expect.any(String),
          }),
        );
      });
    });

    describe('get cards by board', () => {
      let boardId: string;
      beforeEach(async () => {
        const boards = await api.getBoardsByOrganizationId(organizationId);
        boardId = boards[0].id;
      });

      it('should get cards by board with query params', async () => {
        const firstPageCards = await api.getCardsByBoardId(boardId, {
          limit: api.limit,
          sort: '-id',
        });
        const before = firstPageCards.at(-1)?.id;
        const secondPageCards = await api.getCardsByBoardId(boardId, {
          limit: api.limit,
          sort: '-id',
          before: before,
        });

        const firstPageIds = firstPageCards.map((card) => card.id);
        const secondPageIds = secondPageCards.map((card) => card.id);
        secondPageIds.map((id) => expect(firstPageIds.includes(id)).toBe(false));

        expect(secondPageCards[0]).toEqual(
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
        expect(firstPageCards.length).toBeLessThanOrEqual(api.limit);
        expect(secondPageCards.length).toBeLessThanOrEqual(api.limit);
      });

      it('should fetch and parse all board cards correctly', async () => {
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
});
