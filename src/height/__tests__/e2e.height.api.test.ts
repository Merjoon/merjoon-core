import { HeightApi } from '../api';
import { IHeightConfig } from '../types';
const token = process.env.HEIGHT_API_KEY;
if (!token) {
  throw new Error('Height token is not set in the environment variables');
}
describe('HeightApi', () => {
  let heightApi: HeightApi;
  let config: IHeightConfig;
  let getTasksSinceSpy: jest.SpyInstance;
  beforeEach(async () => {
    config = {
      apiKey: token,
      limit: 10,
      maxSockets: 10,
    };
    heightApi = new HeightApi(config);
  });
  afterEach(async () => {
    jest.resetAllMocks();
  });
  describe('getAllTasks', () => {
    it('Should parse tasks data correctly', async () => {
      getTasksSinceSpy = jest.spyOn(heightApi, 'getTasksSince');
      const tasks = await heightApi.getAllTasks();
      const expectedCallCount = tasks.length % heightApi.limit;
      let totalPagesCalledCount = Math.ceil(tasks.length / heightApi.limit);
      if (expectedCallCount === 0) {
        totalPagesCalledCount += 1;
      }
      expect(tasks[0]).toEqual(
        expect.objectContaining({
          assigneesIds: expect.arrayContaining([expect.any(String)]),
          description: expect.any(String),
          id: expect.any(String),
          listIds: expect.arrayContaining([expect.any(String)]),
          name: expect.any(String),
          status: expect.any(String),
          url: expect.any(String),
        }),
      );
      expect(getTasksSinceSpy).toBeCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
    });
  });
  describe('getProjects', () => {
    it('should parse projects data correctly', async () => {
      const projects = await heightApi.getProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
        }),
      );
    });
  });
  describe('getUsers()', () => {
    it('should parse users data correctly', async () => {
      const users = await heightApi.getUsers();
      expect(users[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
        }),
      );
    });
  });
});
