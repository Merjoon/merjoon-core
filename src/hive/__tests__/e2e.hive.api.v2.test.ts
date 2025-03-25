import { HiveApiV2 } from '../api/api-v2';
import { HiveApiV1 } from '../api/api-v1';
import { IHive2Config, IHiveItem } from '../types';
const token = process.env.HIVE_API_KEY;
if (!token) {
  throw new Error('Hive token is not set in the environment variables');
}

describe('HiveV2 API', () => {
  let hive: HiveApiV2;
  let hive1: HiveApiV1;
  let config: IHive2Config;
  let workspaceIds: string[];

  beforeEach(async () => {
    config = { apiKey: token, maxSockets: 10};
    hive = new HiveApiV2(config);
    hive1 = new HiveApiV1(config);
    const workspaces = await hive1.getWorkspaces();
    workspaceIds = workspaces.map((workspace: IHiveItem) => workspace.id);
    expect(workspaceIds.length).toBeGreaterThan(0);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Get Records Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let itemsCount: number;
    let expectedCallCount: number;
    const limit = 50;

    beforeEach(() => {
      getRecordsSpy = jest.spyOn(hive, 'getRecords');
    });

    afterEach(() => {
      expectedCallCount = itemsCount % limit;
      totalPagesCalledCount = Math.ceil(itemsCount / limit);
      if (expectedCallCount === 0) {
        totalPagesCalledCount += 1;
      }
      expect(getRecordsSpy).toBeCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(0);
    });

    describe('getWorkspaceProjects', () => {
      it('should iterate over all workspace projects', async () => {
        const workspaceProjects = await hive.getWorkspaceProjects(workspaceIds[0]);
        itemsCount = workspaceProjects.length;
      });

      it('should parse group data correctly', async () => {
        const workspaceProjects = await hive.getWorkspaceProjects(workspaceIds[0]);
        itemsCount = workspaceProjects.length;
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
      it('should iterate over all workspace actions', async () => {
        const workspaceActions = await hive.getWorkspaceActions(workspaceIds[0]);
        itemsCount = workspaceActions.length;
      });

      it('should parse actions data correctly', async () => {
        const workspaceActions = await hive.getWorkspaceActions(workspaceIds[0]);
        itemsCount = workspaceActions.length;
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
});
