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

  describe('getAllStories', () => {
    it('should iterate over all stories and fetch all pages', async () => {
      const getStoriesSpy = jest.spyOn(api, 'getTasks');
      const getNextSpy = jest.spyOn(api, 'getNext');

      const allEntities = await api.getAllTasks();
      const expectedCallCount = Math.ceil(allEntities.length / config.limit) - 1;

      expect(getStoriesSpy).toHaveBeenCalledTimes(1);
      expect(getNextSpy).toHaveBeenCalledTimes(expectedCallCount);
      expect(expectedCallCount).toBeGreaterThan(0);

      jest.restoreAllMocks();
    });
  });
  it('getAllUsers', async () => {
    const contacts = await api.getAllUsers();
    expect(contacts.data[0]).toEqual(
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
  it('getAllTasks', async () => {
    const issues = await api.getAllTasks();
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
  it('getAllProjects', async () => {
    const projects = await api.getAllProjects();
    expect(projects.data[0]).toEqual(
      expect.objectContaining({
        childIds: expect.any(Array),
        id: expect.any(String),
        scope: expect.any(String),
        title: expect.any(String),
      }),
    );
  });
});
