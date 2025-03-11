jest.setTimeout(15000);
import { WrikeApi } from '../api';
import { IWrikeConfig } from '../types';
const token = process.env.WRIKE_TOKEN;
if (!token) {
  throw new Error('Wrike token is not set in the environment variables');
}
describe('WRIKE API', () => {
  let wrike: WrikeApi;
  let config: IWrikeConfig;
  beforeEach(async () => {
    config = {
      token: token,
      limit: 10,
    };
    wrike = new WrikeApi(config);
  });
  afterEach(async () => {
    jest.restoreAllMocks();
  });
  describe('Get Records Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let itemsCount: number;
    let expectedCallCount: number;

    beforeEach(() => {
      getRecordsSpy = jest.spyOn(wrike, 'getRecords');
    });

    afterEach(() => {
      expectedCallCount =
        itemsCount % wrike.limit === 0
          ? itemsCount / wrike.limit
          : Math.floor(itemsCount / wrike.limit) + 1;

      expect(getRecordsSpy).toHaveBeenCalledTimes(expectedCallCount);
    });

    describe('getAllTasks', () => {
      it('should handle pagination correctly with nextPageToken', async () => {
        getRecordsSpy
          .mockResolvedValueOnce({
            data: Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Task ${i + 1}` })),
            nextPageToken: 'token1',
          })
          .mockResolvedValueOnce({
            data: Array.from({ length: 5 }, (_, i) => ({ id: i + 11, name: `Task ${i + 11}` })),
            nextPageToken: undefined,
          });

        const allTasks = await wrike.getAllTasks();
        itemsCount = allTasks.length;

        expect(itemsCount).toBe(15);

        expect(getRecordsSpy).toHaveBeenCalledTimes(2);
        expect(getRecordsSpy).toHaveBeenCalledWith(
          'tasks',
          expect.objectContaining({
            fields: '[responsibleIds, parentIds, description]',

            nextPageToken: undefined,
            pageSize: 10,
          }),
        );

        expect(getRecordsSpy).toHaveBeenCalledWith(
          'tasks',
          expect.objectContaining({ nextPageToken: 'token1', pageSize: 10 }),
        );
      });

      it('should iterate over all issues and fetch all pages', async () => {
        config.limit = 11;
        const allIssues = await wrike.getAllTasks();
        itemsCount = allIssues.length;
      });
    });
  });

  describe('getAllUsers', () => {
    it('should parse group data correctly', async () => {
      const contacts = await wrike.getAllUsers();
      expect(contacts[0]).toEqual(
        expect.objectContaining({
          avatarUrl: expect.any(String),
          deleted: expect.any(Boolean),
          firstName: expect.any(String),
          id: expect.any(String),
          lastName: expect.any(String),
          locale: expect.any(String),
          primaryEmail: expect.any(String),
          profiles: expect.any(Array),
          timezone: expect.any(String),
          type: expect.any(String),
        }),
      );
    });
  });
  describe('getAllTasks', () => {
    it('should parse issue data correctly', async () => {
      const issues = await wrike.getAllTasks();
      expect(issues[0]).toEqual(
        expect.objectContaining({
          accountId: expect.any(String),
          completedDate: expect.any(String),
          createdDate: expect.any(String),
          customStatusId: expect.any(String),
          dates: expect.any(Object),
          description: expect.any(String),
          id: expect.any(String),
          importance: expect.any(String),
          parentIds: expect.any(Array),
          permalink: expect.any(String),
          priority: expect.any(String),
          responsibleIds: expect.any(Array),
          scope: expect.any(String),
          status: expect.any(String),
          title: expect.any(String),
          updatedDate: expect.any(String),
        }),
      );
    });
  });
  describe('getAllProjects', () => {
    it('should parse project data correctly', async () => {
      const projects = await wrike.getAllProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          childIds: expect.any(Array),
          id: expect.any(String),
          scope: expect.any(String),
          title: expect.any(String),
        }),
      );
    });
  });
});
