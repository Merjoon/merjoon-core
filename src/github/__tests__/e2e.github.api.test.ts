jest.setTimeout(15000);
import { IGithubConfig } from '../types';
import { GithubApi } from '../api';

const apiKey = 'token' + ' ' + process.env.GITHUB_TOKEN;

const subDomain = process.env.GITHUB_SUBDOMAIN;

if (!apiKey) {
  throw new Error('Github token has not been set in the environment variables');
}
if (!subDomain) {
  throw new Error('Github token has not been set in the environment variables');
}

describe('Github API', () => {
  let github: GithubApi;
  let config: IGithubConfig;
  beforeEach(async () => {
    config = {
      apiKey: apiKey,
      subDomain: subDomain,
    };
    github = new GithubApi(config);
  });
  describe('getAllProjects', () => {
    it('must return all projects', async () => {
      const projects = await github.getAllProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
        }),
      );
    });
  });
});
