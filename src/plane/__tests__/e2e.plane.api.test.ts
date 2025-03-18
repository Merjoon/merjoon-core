jest.setTimeout(15000);
import { PlaneApi } from '../api';
import { IPlaneConfig } from '../types';

const token = process.env.PLANE_API_KEY;
if (!token) {
  throw new Error('Plane token is not set in the environment variables');
}

describe('Plane API', () => {
  let plane: PlaneApi;
  let config: IPlaneConfig;

  beforeEach(async () => {
    config = {
      token: token,
    };
    plane = new PlaneApi(config);
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
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      );
    });
  });
});
