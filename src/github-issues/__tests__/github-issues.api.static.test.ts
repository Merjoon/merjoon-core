import { IGithubIssuesLinks } from '../types';
import { GithubIssuesApi } from '../api';

describe('parseLinkHeader', () => {
  it('should test the first page of parsed urls, if we have 2 entries', async () => {
    const linkHeader =
      '<https://api.github.com/organizations/179821660/members?per_page=1&page=2>; rel="next", <https://api.github.com/organizations/179821660/members?per_page=1&page=2>; rel="last"';
    const parsedUrls: IGithubIssuesLinks = GithubIssuesApi.parseLinkHeader(linkHeader);
    expect(parsedUrls).toEqual({
      last: 'https://api.github.com/organizations/179821660/members?per_page=1&page=2',
      next: 'https://api.github.com/organizations/179821660/members?per_page=1&page=2',
    });
  });

  it('should test the second page of parsed urls, if we have 2 entries', async () => {
    const linkHeader =
      '<https://api.github.com/organizations/179821660/repos?per_page=1&page=1>; rel="prev", <https://api.github.com/organizations/179821660/repos?per_page=1&page=1>; rel="first"';
    const parsedUrls: IGithubIssuesLinks = GithubIssuesApi.parseLinkHeader(linkHeader);
    expect(parsedUrls).toEqual({
      first: 'https://api.github.com/organizations/179821660/repos?per_page=1&page=1',
      prev: 'https://api.github.com/organizations/179821660/repos?per_page=1&page=1',
    });
  });

  it('should test the first page of parsed urls, if we have more than 2 entries', async () => {
    const linkHeader =
      '<https://api.github.com/repositories/971262596/issues?per_page=3&page=2&after=Y3Vyc29yOnYyOpLPAAABlmHoX8jOs5p-pw%3D%3D>; rel="next"';
    const parsedUrls: IGithubIssuesLinks = GithubIssuesApi.parseLinkHeader(linkHeader);
    expect(parsedUrls).toEqual({
      next: 'https://api.github.com/repositories/971262596/issues?per_page=3&page=2&after=Y3Vyc29yOnYyOpLPAAABlmHoX8jOs5p-pw%3D%3D',
    });
  });

  it('should test all pages except for the first and last pages of parsed urls, if we have more than 2 entries', async () => {
    const linkHeader =
      '<https://api.github.com/repositories/971262596/issues?per_page=3&page=3&after=Y3Vyc29yOnYyOpLPAAABlmHmqkjOs5pmGQ%3D%3D>; rel="next", <https://api.github.com/repositories/971262596/issues?per_page=3&page=1&before=Y3Vyc29yOnYyOpLPAAABlmHoIUjOs5p6rQ%3D%3D>; rel="prev"';
    const parsedUrls: IGithubIssuesLinks = GithubIssuesApi.parseLinkHeader(linkHeader);
    expect(parsedUrls).toEqual({
      next: 'https://api.github.com/repositories/971262596/issues?per_page=3&page=3&after=Y3Vyc29yOnYyOpLPAAABlmHmqkjOs5pmGQ%3D%3D',
      prev: 'https://api.github.com/repositories/971262596/issues?per_page=3&page=1&before=Y3Vyc29yOnYyOpLPAAABlmHoIUjOs5p6rQ%3D%3D',
    });
  });

  it('should test the last page of parsed urls, if we have more than 2 entries', async () => {
    const linkHeader =
      '<https://api.github.com/repositories/971262596/issues?per_page=3&page=3&before=Y3Vyc29yOnYyOpLPAAABlmHkvhjOs5pNHA%3D%3D>; rel="prev"';
    const parsedUrls: IGithubIssuesLinks = GithubIssuesApi.parseLinkHeader(linkHeader);
    expect(parsedUrls).toEqual({
      prev: 'https://api.github.com/repositories/971262596/issues?per_page=3&page=3&before=Y3Vyc29yOnYyOpLPAAABlmHkvhjOs5pNHA%3D%3D',
    });
  });
});
