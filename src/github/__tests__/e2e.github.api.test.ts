jest.setTimeout(15000);

import { IGithubConfig } from '../types';
import { GithubApi } from '../api';

const apiKey = process.env.GITHUB_TOKEN;

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
      limit: 1,
    };
    github = new GithubApi(config);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('Get repos pagination', () => {
    let getReposSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let pageCount: number;
    let itemsCount: number;
    beforeEach(() => {
      getReposSpy = jest.spyOn(github, 'getRecords');
    });
    afterEach(() => {
      pageCount = itemsCount % github.limit;
      totalPagesCalledCount = Math.ceil(itemsCount / github.limit);
      if (pageCount === 0) {
        totalPagesCalledCount++;
      }
      expect(totalPagesCalledCount).toBeGreaterThan(2);
      expect(getReposSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
    });
    describe('getAllProjects', () => {
      it('must return all projects', async () => {
        const projects = await github.getAllProjects();
        itemsCount = projects.length;
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
});
