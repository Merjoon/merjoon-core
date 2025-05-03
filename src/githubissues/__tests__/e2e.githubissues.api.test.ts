import { IGithubIssuesConfig } from '../types';
import { GithubIssuesApi } from '../api';

const apiKey = process.env.GITHUB_ISSUES_TOKEN;

const subDomain = process.env.GITHUB_ISSUES_SUBDOMAIN;

if (!apiKey) {
  throw new Error('Github token has not been set in the environment variables');
}
if (!subDomain) {
  throw new Error('Github token has not been set in the environment variables');
}

describe('Github API', () => {
  let githubIssues: GithubIssuesApi;
  let config: IGithubIssuesConfig;
  beforeEach(async () => {
    config = {
      apiKey: apiKey,
      subDomain: subDomain,
      limit: 1,
    };
    githubIssues = new GithubIssuesApi(config);
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
      getReposSpy = jest.spyOn(githubIssues, 'getRecords');
    });
    afterEach(() => {
      pageCount = itemsCount % githubIssues.limit;
      totalPagesCalledCount = Math.ceil(itemsCount / githubIssues.limit);
      if (pageCount === 0) {
        totalPagesCalledCount++;
      }
      expect(totalPagesCalledCount).toBeGreaterThan(2);
      expect(getReposSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
    });
    describe('getAllProjects', () => {
      it('must return all projects', async () => {
        const projects = await githubIssues.getAllProjects();
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
