import { HiveApiV2 } from '../api/api-v2';
import { HiveApiV1 } from '../api/api-v1';
import { IHive1Config, IHive2Config } from '../types';
const token = process.env.HIVE_API_KEY;
if (!token) {
  throw new Error('Hive token is not set in the environment variables');
}

describe('HiveV2 API', () => {
  let hive: HiveApiV2;
  let config: IHive2Config;
  let limit: number;
  let workspaceId: string;

  beforeAll(async () => {
    const configV1: IHive1Config = { apiKey: token };
    const hiveV1 = new HiveApiV1(configV1);
    const workspaces = await hiveV1.getWorkspaces();
    workspaceId = workspaces[0].id;
  });

  beforeEach(async () => {
    config = { apiKey: token, maxSockets: 10, limit: 40 };
    limit = config.limit;
    hive = new HiveApiV2(config);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Get Records Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let itemsCount: number;

    beforeEach(() => {
      getRecordsSpy = jest.spyOn(hive, 'getRecords');
    });

    afterEach(() => {
      totalPagesCalledCount = Math.ceil(itemsCount / limit);
      expect(getRecordsSpy).toBeCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
    });

    describe('getWorkspaceProjects', () => {
      it('should iterate over all workspace projects', async () => {
        const workspaceProjects = await hive.getWorkspaceProjects(workspaceId);
        itemsCount = workspaceProjects.length;
      });
    });
    describe('getWorkspaceActions', () => {
      it('should iterate over all workspace actions', async () => {
        const workspaceActions = await hive.getWorkspaceActions(workspaceId);
        itemsCount = workspaceActions.length;
      });
    });
  });

  describe('getWorkspaceProjects', () => {
    it('should parse WorkspaceProject data correctly', async () => {
      const workspaceProjects = await hive.getWorkspaceProjects(workspaceId);
      expect(workspaceProjects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(String),
          modifiedAt: expect.any(String),
        }),
      );
    });
  });
  describe('getWorkspaceActions', () => {
    it('should parse actions data correctly', async () => {
      const workspaceActions = await hive.getWorkspaceActions(workspaceId);
      expect(workspaceActions[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          status: expect.any(String),
          description: expect.any(String),
          createdAt: expect.any(String),
          modifiedAt: expect.any(String),
        }),
      );
    });
  });
});
