import { FreedcampApi } from '../api';
import { IFreedcampConfig } from '../types';

const token = process.env.FREEDCAMP_TOKEN;
if (!token) {
  throw new Error('Freedcamp token is not set in the environment variables');
}

describe('Freedcamp API', () => {
  let freedcamp: FreedcampApi;
  let config: IFreedcampConfig;

  beforeEach(async () => {
    config = {
      token,
    };
    freedcamp = new FreedcampApi(config);
  });
  describe('GetAllProjects', () => {
    it('should parse Projects data correctly', async () => {
      const projects = await freedcamp.getProjects();

      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          project_name: expect.any(String),
          project_description: expect.any(String),
          created_ts: expect.any(Number),
        }),
      );
    });
  });
});
