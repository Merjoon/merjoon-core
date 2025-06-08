import { QuireApi } from '../api';
import { IQuireConfig } from '../types';

const clientId = process.env.QUIRE_CLIENT_ID;
const clientSecret = process.env.QUIRE_CLIENT_SECRET;
const refreshToken = process.env.QUIRE_REFRESH;

if (!refreshToken || !clientId || !clientSecret) {
  throw new Error('Missing required parameters');
}

describe('Quire API sendGetRequest', () => {
  let api: QuireApi;
  let config: IQuireConfig;
  let oid: string;
  let limit: number;

  beforeAll(async () => {
    config = {
      token: 'invalid_token',
      refreshToken,
      clientId,
      clientSecret,
      limit: 20,
    };

    api = new QuireApi(config);
    const projects = await api.getAllProjects();
    oid = projects[0].oid;
  });

  beforeEach(() => {
    limit = config.limit;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Get Records Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let itemsCount: number;

    beforeEach(() => {
      getRecordsSpy = jest.spyOn(api, 'getRecords');
    });

    afterEach(() => {
      totalPagesCalledCount = Math.ceil(itemsCount / limit);
      expect(getRecordsSpy).toBeCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
    });

    describe('getAllTasks', () => {
      it('should iterate over all tasks and fetch all pages', async () => {
        const allTasks = await api.getAllTasks(oid);
        itemsCount = allTasks.length;
      });
    });

    describe('getAllProjects', () => {
      it('should iterate over all projects and fetch all pages', async () => {
        const allProjects = await api.getAllProjects();
        itemsCount = allProjects.length;
      });
    });

    describe('getAllUsers', () => {
      it('should iterate over all users and fetch all pages', async () => {
        const allUsers = await api.getAllUsers();
        itemsCount = allUsers.length;
      });
    });
  });

  describe('getAllTasks', () => {
    it('should parse Tasks data correctly', async () => {
      const tasks = await api.getAllTasks(oid);

      expect(tasks[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          createdAt: expect.any(String),
          editedAt: expect.any(String),
          assignees: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              oid: expect.any(String),
            }),
          ]),
          status: expect.objectContaining({
            value: expect.any(Number),
            name: expect.any(String),
            color: expect.any(String),
          }),
          description: expect.any(String),
          url: expect.any(String),
        }),
      );
    });
  });

  describe('getAllProjects', () => {
    it('should parse Projects data correctly', async () => {
      const projects = await api.getAllProjects();

      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          oid: expect.any(String),
          createdAt: expect.any(String),
          editedAt: expect.any(String),
          description: expect.any(String),
        }),
      );
    });
  });

  describe('getAllUsers', () => {
    it('should parse Users data correctly', async () => {
      const users = await api.getAllUsers();

      expect(users[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          email: expect.any(String),
          oid: expect.any(String),
          description: expect.any(String),
          image: expect.any(String),
        }),
      );
    });
  });

  describe('getNewToken', () => {
    it('should refresh the access token and change it from the old one', async () => {
      const oldToken = api.accessToken;

      await api.refreshAccessToken();

      expect(api.accessToken).toBeDefined();
      expect(api.accessToken).not.toEqual('');
      expect(api.accessToken).not.toEqual(oldToken);
    });
  });
});
