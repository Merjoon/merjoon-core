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

  beforeAll(async () => {
    config = {
      token: 'invalid_token',
      refreshToken: refreshToken,
      clientId: clientId,
      clientSecret: clientSecret,
      limit: 10,
    };

    api = new QuireApi(config);

    const projects = await api.getAllProjects();
    oid = projects[0].oid;
  });

  beforeEach(() => {
    api = new QuireApi(config);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Get Records Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let pageCount: number;
    let itemsCount: number;

    beforeEach(() => {
      getRecordsSpy = jest.spyOn(api, 'getRecords');
    });

    afterEach(() => {
      pageCount = itemsCount % api.limit;
      totalPagesCalledCount = Math.ceil(itemsCount / api.limit);
      if (pageCount === 0) {
        totalPagesCalledCount += 1;
      }
      expect(totalPagesCalledCount).toBeGreaterThan(0);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
    });

    describe('GetAllTasks', () => {
      it('should iterate over all tasks and fetch all pages', async () => {
        const allTasks = await api.getAllTasks(oid);
        itemsCount = allTasks.length;
      });
    });

    describe('getAllProjects', () => {
      it('should iterate over all projects and fetch all pages with limit = 1', async () => {
        config.limit = 1;
        const allProjects = await api.getAllProjects();
        itemsCount = allProjects.length;
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
          section_name: expect.any(String),
          project_id: expect.any(Number),
          created_at: expect.any(String),
          assigned_to_id: expect.any(Number),
          assignee_name: expect.any(String),
          updated_at: expect.any(String),
          notes: expect.any(String),
        }),
      );
    });
  });

  describe('getAllProjects', () => {
    it('should parse Projects data correctly', async () => {
      const projects = await api.getAllProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          notes: expect.any(String),
        }),
      );
    });
  });
  it('should refresh the access token and change it from the old one', async () => {
    const oldToken = api.accessToken;

    await api.refreshAccessToken();

    expect(api.accessToken).toBeDefined();
    expect(api.accessToken).not.toEqual('');
    expect(api.accessToken).not.toEqual(oldToken);
  });
});
