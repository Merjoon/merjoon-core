import { HiveApiV2 } from '../api/api-v2';
import { HiveApiV1 } from '../api/api-v1';
import { IHiveConfig, IHiveItem } from '../types';

const token = process.env.HIVE_API_KEY;
if (!token) {
  throw new Error('Hive token is not set in the environment variables');
}

describe('HiveV2 API', () => {
  let hive: HiveApiV2;
  let hive1: HiveApiV1;
  let config: IHiveConfig;
  let workspaceIds: string[];
  const limit = 50;
  let totalPagesCalledCount: number;
  let itemsCount: number;
  let expectedCallCount: number;

  beforeAll(async () => {
    config = { apiKey: token };
    hive = new HiveApiV2(config);
    hive1 = new HiveApiV1(config);
    const workspaces = await hive1.getWorkspaces();
    expect(workspaces.length).toBeGreaterThan(0);
    workspaceIds = workspaces.map((workspace: IHiveItem) => workspace.id);
  });
  beforeEach(() => {
    totalPagesCalledCount = 0;
    itemsCount = 0;
    expectedCallCount = 0;
  });
  afterEach(() => {
    expectedCallCount =
      itemsCount % limit === 0 ? itemsCount / limit : Math.ceil(itemsCount / limit);
    if (expectedCallCount === 0) {
      expectedCallCount += 1;
    }
    expect(totalPagesCalledCount).toBeGreaterThan(0);
    expect(totalPagesCalledCount).toBe(expectedCallCount);
  });

  describe('Get Records Pagination', () => {
    let getRecordsSpy: jest.SpyInstance;

    beforeEach(() => {
      getRecordsSpy = jest.spyOn(hive, 'getRecords');
    });

    afterEach(() => {
      expect(getRecordsSpy).toBeCalledTimes(totalPagesCalledCount);
    });

    it('should have workspaceIds', () => {
      expect(workspaceIds).toBeDefined();
      expect(workspaceIds.length).toBeGreaterThan(0);
    });

    describe('getWorkspaceProjects', () => {
      it('should iterate over all workspace projects', async () => {
        for (const workspaceId of workspaceIds) {
          const workspaceProjects = await hive.getWorkspaceProjects(workspaceId);
          itemsCount = workspaceProjects.length;
        }
      });

      it('should parse group data correctly', async () => {
        for (const workspaceId of workspaceIds) {
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
        }
      });
    });

    describe('getWorkspaceActions', () => {
      it('should iterate over all workspace actions', async () => {
        for (const workspaceId of workspaceIds) {
          const workspaceActions = await hive.getWorkspaceActions(workspaceId);
          itemsCount = workspaceActions.length;
        }
      });

      it('should parse actions data correctly', async () => {
        for (const workspaceId of workspaceIds) {
          const workspaceActions = await hive.getWorkspaceActions(workspaceId);
          expect(workspaceActions[0]).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
              assignees: expect.any(String || null),
              status: expect.any(String),
              description: expect.any(String),
              projectId: expect.any(String),
              createdAt: expect.any(String),
              modifiedAt: expect.any(String),
            }),
          );
        }
      });
    });
  });
});
