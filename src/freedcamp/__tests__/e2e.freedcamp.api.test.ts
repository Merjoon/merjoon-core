import { FreedcampApi } from '../api';
import { IFreedcampConfig } from '../types';

const apiKey = process.env.FREEDCAMP_API_KEY;
if (!apiKey) {
  throw new Error('Freedcamp apiKey is not set in the environment variables');
}

describe('Freedcamp API', () => {
  let freedcamp: FreedcampApi;
  let config: IFreedcampConfig;

  beforeEach(async () => {
    config = {
      apiKey,
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
