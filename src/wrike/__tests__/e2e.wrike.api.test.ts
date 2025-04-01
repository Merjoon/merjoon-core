import { WrikeApi } from '../api';
import { IWrikeConfig } from '../types';
const token = process.env.WRIKE_TOKEN;
if (!token) {
  throw new Error('Wrike token is not set in the environment variables');
}
describe('WRIKE API', () => {
  let api: WrikeApi;
  let config: IWrikeConfig;
  beforeEach(() => {
    config = {
      token: token,
      limit: 10,
    };
    api = new WrikeApi(config);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('getAllTasks', () => {
    it('should iterate over all tasks and fetch all pages', async () => {
      const getStoriesSpy = jest.spyOn(api, 'getTasks');
      const getNextSpy = jest.spyOn(api, 'getNext');

      const allEntities = await api.getAllTasks();
      const expectedGetNextCallsCount = Math.ceil(allEntities.length / config.limit) - 1;

      expect(getStoriesSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedGetNextCallsCount);
      expect(expectedGetNextCallsCount).toBeGreaterThan(0);

      jest.restoreAllMocks();
    });
  });
  it('getAllUsers', async () => {
    const contacts = await api.getAllUsers();
    expect(contacts.data[0]).toEqual(
      expect.objectContaining({
        firstName: expect.any(String),
        id: expect.any(String),
        lastName: expect.any(String),
        primaryEmail: expect.any(String),
      }),
    );
  });
  it('getAllTasks', async () => {
    const tasks = await api.getAllTasks();
    expect(tasks[0]).toEqual(
      expect.objectContaining({
        createdDate: expect.any(String),
        description: expect.any(String),
        parentIds: expect.arrayContaining([expect.any(String)]),
        permalink: expect.any(String),
        responsibleIds: expect.arrayContaining([expect.any(String)]),
        status: expect.any(String),
        title: expect.any(String),
        updatedDate: expect.any(String),
      }),
    );
  });
  it('getAllProjects', async () => {
    const projects = await api.getAllProjects();
    expect(projects.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
      }),
    );
  });
});
