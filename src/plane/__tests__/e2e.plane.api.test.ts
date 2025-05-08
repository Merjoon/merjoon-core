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
    describe('getAllIssues', () => {
      it('should iterate over all issues of a project and return unique IDs', async () => {
        const getIssuesSpy = jest.spyOn(plane, 'getIssuesByProjectId');

        const projects = await plane.getProjects();
        const projectId = projects[0]?.id;

        const issues = await plane.getAllIssues(projectId);
        const itemsCount = issues.length;
        const totalPagesCalledCount = Math.ceil(itemsCount / plane.limit);

        const issueIds = issues.map((issue) => issue.id);
        const uniqueIds = new Set(issueIds);

        expect(issueIds.length).toBe(uniqueIds.size);
        expect(getIssuesSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
        expect(totalPagesCalledCount).toBeGreaterThan(1);
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
          assignees: expect.arrayContaining([expect.any(Object)]),
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

    describe('getAllUsers', () => {
    it('should fetch all users from issue assignees', async () => {
        const projects = await plane.getProjects();
        const projectId = projects[0].id;
        const users = await plane.getAllUsers(projectId);

        expect(users.length).toBeGreaterThan(0);
        expect(users).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    first_name: expect.any(String),
                    last_name: expect.any(String),
                    email: expect.any(String),
                    display_name: expect.any(String),
                })
            ])
        );
    });
});

});
