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
    };
    heightApi = new HeightApi(config);
  });
  afterEach(async () => {
    jest.resetAllMocks();
  });
  describe('getTasks', () => {
    it('should pars tasks data correctly', async () => {
      getTasksSinceSpy = jest.spyOn(heightApi, 'getTasksSince');
      const tasks = await heightApi.getAllTasks();
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
      expect(getTasksSinceSpy).toHaveBeenCalled();
    });
  });
  describe('getProjects', () => {
    it('should pars projects data correctly', async () => {
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
    it('should pars users data correctly', async () => {
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
