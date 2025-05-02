jest.setTimeout(15000);
import { PlaneApi } from '../api';
import { IPlaneConfig } from '../types';

const apiKey = process.env.PLANE_API_KEY;
const workspaceSlug = process.env.PLANE_WORKSPACE_SLUG;

if (!apiKey) {
  throw new Error('Plane token is not set in the environment variables');
}
if (!workspaceSlug) {
  throw new Error('Workspace slug is not set in the environment variables');
}

describe('Plane API', () => {
  let plane: PlaneApi;
  let config: IPlaneConfig;

  beforeEach(() => {
    config = {
      apiKey,
      workspaceSlug,
      limit: 3,
    };
    plane = new PlaneApi(config);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('Plane Issues Pagination', () => {
    let getAllIssuesSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let itemsCount: number;

    beforeEach(() => {
      getAllIssuesSpy = jest.spyOn(plane, 'getIssues');
    });
    afterEach(() => {
      totalPagesCalledCount = Math.ceil(itemsCount / plane.limit);
      expect(getAllIssuesSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
      expect(totalPagesCalledCount).toBeGreaterThan(1);
    });

    describe('getAllIssues', () => {
      it('should iterate over all issues of a project and return unique IDs', async () => {
        const projects = await plane.getProjects();
        const projectId = projects[0]?.id;

        const issues = await plane.getAllIssues(projectId);
        itemsCount = issues.length;

        const issueIds = issues.map((issue) => issue.id);
        const uniqueIds = new Set(issueIds);

        expect(issueIds.length).toBe(uniqueIds.size);
      });
    });
  });
  describe('getProjects', () => {
    it('should fetch projects', async () => {
      const projects = await plane.getProjects();
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
    });
  });

  describe('getAllIssues', () => {
    it('should fetch all issues for first project', async () => {
      const projects = await plane.getProjects();
      const projectId = projects[0].id;
      const issues = await plane.getAllIssues(projectId);

      expect(issues[0].assignees.length).toBeGreaterThan(0);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description_stripped: expect.any(String),
          assignees: expect.arrayContaining([expect.any(String)]),
          project: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          state: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        }),
      );
    });
  });
});
