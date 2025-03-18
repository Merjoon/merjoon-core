jest.setTimeout(15000);
import { Plane } from '../api';
import { IPlaneConfig } from '../types';

const token = process.env.PLANE_TOKEN;
if (!token) {
  throw new Error('Plane token is not set in the environment variables');
}

describe('Plane API', () => {
  let plane: Plane;
  let config: IPlaneConfig;

  beforeEach(async () => {
    config = {
      token: token,
    };
    plane = new Plane(config);
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });

  describe('getAllProjects', () => {
    it('should fetch all projects', async () => {
      const projects = await plane.getAllProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          identifier: expect.any(String),
          workspace: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
    });
  });
});
