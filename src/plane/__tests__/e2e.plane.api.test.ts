jest.setTimeout(15000);
import { PlaneApi } from '../api';
import { IPlaneConfig, IPlaneIssue } from '../types';

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
      apiKey: apiKey,
      workspaceSlug: workspaceSlug,
      maxSockets: 10,
      limit: 100,
    };
    plane = new PlaneApi(config);
  });
  afterEach(async () => {
    jest.restoreAllMocks();
  });

  it('should fetch paginated issues correctly', async () => {
    const iterator = plane.getAllIssuesIterator();
    let allIssues: IPlaneIssue[] = [];
    let previousCursor: string | null = null;
    let pageCount = 0;

    for await (const { data, isLast } of iterator) {
      expect(data).toBeInstanceOf(Array);
      expect(data.length).toBeGreaterThan(0);
      allIssues = allIssues.concat(data);
      pageCount++;

      if (!isLast) {
        expect(previousCursor).not.toEqual(data[data.length - 1].id);
        previousCursor = data[data.length - 1].id;
      }
    }

    expect(allIssues.length).toBeGreaterThan(0);
    expect(pageCount).toBeGreaterThan(0);
  });

  describe('getAllProjects', () => {
    it('should fetch all projects', async () => {
      const projects = await plane.getAllProjects();
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
    it('should fetch all issues', async () => {
      const issues = await plane.getAllIssues();
      expect(issues[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description_html: expect.any(String),
          assignees: expect.any(Array),
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
