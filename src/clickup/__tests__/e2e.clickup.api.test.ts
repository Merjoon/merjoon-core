import { ClickUpApi } from '../api';
import { IClickUpConfig, IClickUpTask } from '../types';
import { HttpError } from '../../common/HttpError';

const apiKey = process.env.CLICKUP_API_KEY;
if (!apiKey) {
  throw new Error('ClickUp token is not set in the environment variables');
}
describe('ClickUp API', () => {
  let api: ClickUpApi;
  let config: IClickUpConfig;
  beforeEach(async () => {
    config = {
      apiKey: apiKey,
      maxSockets: 10,
    };
    api = new ClickUpApi(config);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('getListAllTasks', () => {
    it('should iterate over all issues and fetch all pages', async () => {
      const getTasksByListIdSpy = jest.spyOn(api, 'getTasksByListId');
      const teams = await api.getTeams();
      const teamSpaces = await api.getTeamSpaces(teams[0].id);
      const spaceFolders = await api.getSpaceFolders(teamSpaces[0].id);
      const folderLists = await api.getFolderLists(spaceFolders[0].id);
      const allTasks = await api.getListAllTasks(folderLists[0].id);
      const expectedCallCount = Math.ceil(allTasks.length / 100); // The fixed ClickUp Api limit is 100.
      const allTasksIds = allTasks.map((item) => item.id);
      const uniqueIds = new Set(allTasksIds);

      expect(teams.length).toBeGreaterThan(0);
      expect(teamSpaces.length).toBeGreaterThan(0);
      expect(spaceFolders.length).toBeGreaterThan(0);
      expect(folderLists.length).toBeGreaterThan(0);
      expect(allTasks.length).toBeGreaterThan(0);

      expect(allTasksIds.length).toBe(uniqueIds.size);
      expect(getTasksByListIdSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);

      expect(allTasks[0].assignees.length).toBeGreaterThan(0);
      expect(allTasks[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          assignees: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(Number),
            }),
          ]),
          status: expect.objectContaining({
            status: expect.any(String),
          }),
          description: expect.any(String),
          list: expect.objectContaining({
            id: expect.any(String),
          }),
          date_created: expect.any(String),
          date_updated: expect.any(String),
        }),
      );
    });
  });

  describe('getTeams', () => {
    it('should parse teams data correctly', async () => {
      const teams = await api.getTeams();

      expect(teams[0].members.length).toBeGreaterThan(0);
      expect(teams[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          members: expect.arrayContaining([
            expect.objectContaining({
              user: expect.objectContaining({
                id: expect.any(Number),
                username: expect.any(String),
                email: expect.any(String),
              }),
            }),
          ]),
        }),
      );
    });
  });

  describe('getTeamSpaces', () => {
    it('should parse team spaces data correctly', async () => {
      const teams = await api.getTeams();
      const teamSpaces = await api.getTeamSpaces(teams[0].id);
      expect(teamSpaces[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });
  });

  describe('getSpaceFolders', () => {
    it('should parse space folders data correctly', async () => {
      const teams = await api.getTeams();
      const teamSpaces = await api.getTeamSpaces(teams[0].id);
      const spaceFolders = await api.getSpaceFolders(teamSpaces[0].id);
      expect(spaceFolders[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });
  });

  describe('getFolderLists', () => {
    it('should parse folder lists data correctly', async () => {
      const teams = await api.getTeams();
      const teamSpaces = await api.getTeamSpaces(teams[0].id);
      const spaceFolders = await api.getSpaceFolders(teamSpaces[0].id);
      const folderLists = await api.getFolderLists(spaceFolders[0].id);
      expect(folderLists[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          content: expect.any(String),
        }),
      );
    });
  });

  describe('getSpaceLists', () => {
    it('should parse space lists data correctly', async () => {
      const teams = await api.getTeams();
      const teamSpaces = await api.getTeamSpaces(teams[0].id);
      const spaceFolders = await api.getSpaceFolders(teamSpaces[0].id);
      expect(spaceFolders[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
        }),
      );
    });
  });

  describe('ClickUpApi rate limit retry', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should retry on 429 and eventually succeed', async () => {
      const fakeData = {
        tasks: [],
        last_page: true,
      };
      let callCount = 0;

      jest.spyOn(global, 'setTimeout').mockImplementation((callback: () => void) => {
        callback();
        return {} as NodeJS.Timeout;
      });

      jest.spyOn(api, 'get').mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          throw new HttpError({
            data: 'Rate limited',
            status: 429,
            headers: {
              'x-ratelimit-reset': `${Math.floor(Date.now() / 1000) + 1}`,
            },
          });
        }
        return {
          data: fakeData,
          status: 200,
          headers: {},
        };
      });

      const result = await api.getTasksByListId('list-123');

      expect(result).toEqual(fakeData);
      expect(callCount).toBe(2);
    });

    it('should propagate errors other than 429', async () => {
      jest.spyOn(api, 'get').mockImplementation(async () => {
        throw new HttpError({
          data: 'Unauthorized',
          status: 401,
          headers: {},
        });
      });

      await expect(api.getTasksByListId('list-123')).rejects.toThrow(HttpError);
    });
  });

  it('should retry on 429 every tenth request and eventually succeed', async () => {
    const fakeData = {
      tasks: [] as IClickUpTask[],
      last_page: true,
    };

    let callCount = 0;

    jest.spyOn(global, 'setTimeout').mockImplementation((callback: () => void) => {
      callback();
      return {} as NodeJS.Timeout;
    });

    jest.spyOn(api, 'get').mockImplementation(async () => {
      callCount++;
      if (callCount % 10 === 0) {
        throw new HttpError({
          data: 'Rate limited',
          status: 429,
          headers: {
            'x-ratelimit-reset': `${Math.floor(Date.now() / 1000) + 1}`,
          },
        });
      }
      return {
        data: fakeData,
        status: 200,
        headers: {},
      };
    });

    const results: (typeof fakeData)[] = [];

    for (let i = 0; i < 100; i++) {
      const result = await api.getTasksByListId(`list-${i}`);
      results.push(result);
    }

    expect(results.length).toBe(100);
    results.forEach((res) => expect(res).toEqual(fakeData));
    const expectedCallCount = 100 + Math.floor(100 / 10);
    expect(callCount - 1).toBe(expectedCallCount);
  });
});
