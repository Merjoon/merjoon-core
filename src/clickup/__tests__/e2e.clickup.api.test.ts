import { ClickUpApi } from '../api';
import { IClickUpConfig } from '../types';
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
      const expectedCallCount = Math.ceil(allTasks.length / 100);
      const allTasksIds = allTasks.map((item) => item.id);
      const uniqueIds = new Set(allTasksIds);

      expect(allTasksIds.length).toBe(uniqueIds.size);
      expect(getTasksByListIdSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);

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
      jest.restoreAllMocks();
    });
  });

  describe('getTeams', () => {
    it('should parse teams data correctly', async () => {
      const teams = await api.getTeams();
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
});
