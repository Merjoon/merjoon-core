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
      limit: 10,
    };
    plane = new PlaneApi(config);
  });


  describe('getAllProjects', () => {
    it('should fetch all projects', async () => {
      const projects = await plane.getAllProjects();
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
      const projects = await plane.getAllProjects();
      const projectId = projects[0].id;
      const issues = await plane.getAllIssues(projectId);

      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description_html: expect.any(String),
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
