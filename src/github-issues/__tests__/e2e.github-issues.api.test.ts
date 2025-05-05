import { IGithubIssuesConfig } from '../types';
import { GithubIssuesApi } from '../api';

const apiKey = process.env.GITHUB_ISSUES_TOKEN;

const organization = process.env.GITHUB_ISSUES_ORG;

if (!apiKey) {
  throw new Error('Github issues token has not been set in the environment variables');
}
if (!organization) {
  throw new Error('Github issues organization has not been set in the environment variables');
}

describe('Github Issues API', () => {
  let githubIssues: GithubIssuesApi;
  let config: IGithubIssuesConfig;
  beforeEach(async () => {
    config = {
      apiKey: apiKey,
      organization: organization,
      limit: 1,
    };
    githubIssues = new GithubIssuesApi(config);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('Get repos pagination', () => {
    let getRecordsSpy: jest.SpyInstance;
    let totalPagesCalledCount: number;
    let pageCount: number;
    let itemsCount: number;
    beforeEach(() => {
      getRecordsSpy = jest.spyOn(githubIssues, 'getRecords');
    });
    afterEach(() => {
      pageCount = itemsCount % githubIssues.limit;
      totalPagesCalledCount = Math.ceil(itemsCount / githubIssues.limit);
      if (pageCount === 0) {
        totalPagesCalledCount++;
      }
      expect(totalPagesCalledCount).toBeGreaterThan(2);
      expect(getRecordsSpy).toHaveBeenCalledTimes(totalPagesCalledCount);
    });
    describe('getAllRepos', () => {
      it('must return all repos', async () => {
        const repos = await githubIssues.getAllRepos();
        itemsCount = repos.length;
        expect(repos[0]).toEqual(
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
