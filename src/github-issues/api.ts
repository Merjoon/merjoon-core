import * as querystring from 'node:querystring';
import { HttpClient } from '../common/HttpClient';
import {
  IGithubIssueQueryParams,
  IGithubIssuesConfig,
  IGithubIssuesMember,
  IGithubIssuesOrg,
  IGithubIssuesRepo,
  IGithubIssuesRepoIssue,
} from './types';
import { IMerjoonApiConfig } from '../common/types';
import { GITHUB_ISSUES_PATH } from './consts';

export class GithubIssuesApi extends HttpClient {
  public static getUrls(headersLink: string) {
    const links = headersLink.split(',');
    const regExp = /rel="(first|next|last|prev)"/;
    let linkKeyShorted: string;
    let trimmedLink;
    return links.reduce<Record<string, string>>((acc, link) => {
      trimmedLink = link.trim();
      const linkKeyValue = trimmedLink.split(';');
      const [linkValue, linkKey] = linkKeyValue;
      if (regExp.test(linkKey)) {
        linkKeyShorted = linkKey.replace(/^\srel="(last|next|first|prev)"$/, '$1');
      }
      acc[linkKeyShorted] = linkValue.slice(1, -1);
      return acc;
    }, {});
  }
  public readonly limit: number;
  constructor(protected config: IGithubIssuesConfig) {
    const basePath = 'https://api.github.com';
    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Bearer ${config.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
    };
    super(apiConfig);
    this.limit = config.limit || 100;
  }
  async *getAllIterator<T>(path: string) {
    let body = await this.getRecords<T>(path, {
      per_page: this.limit,
    });
    yield body.data;
    let headersLink = body.headers.link as string | undefined;
    if (headersLink) {
      let linksInObj = GithubIssuesApi.getUrls(headersLink);
      while ('next' in linksInObj) {
        const nextLink = linksInObj.next.split('.com/')[1];
        body = await this.getNext(nextLink);
        yield body.data;
        headersLink = body.headers.link as string | undefined;
        if (headersLink) {
          linksInObj = GithubIssuesApi.getUrls(headersLink);
        }
      }
    }
  }
  public async getNext<T>(nextParams: string) {
    const nextPathQuery = nextParams.split('?');
    const [nextPath, nextQueryParams] = nextPathQuery;
    const nextQueries: IGithubIssueQueryParams = querystring.parse(nextQueryParams);
    const nextQueriesInObj = {
      ...nextQueries,
    };
    return this.sendGetRequest<T>(nextPath, nextQueriesInObj);
  }
  protected async getAllRecords<T>(path: string) {
    const iterator = this.getAllIterator<T>(path);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }
    return records;
  }
  public getRecords<T>(path: string, queryParams?: IGithubIssueQueryParams) {
    return this.sendGetRequest<T[]>(path, queryParams);
  }
  public async getRepoAllIssues(member: string, repository: string) {
    const path = GITHUB_ISSUES_PATH.REPO_ISSUES(member, repository);
    return this.getAllRecords<IGithubIssuesRepoIssue>(path);
  }
  public async getUserAllOrgs() {
    return this.getAllRecords<IGithubIssuesOrg>(GITHUB_ISSUES_PATH.USER_ORGS);
  }
  public async getAllReposByOrgId(id: number) {
    const path = GITHUB_ISSUES_PATH.ORG_REPOS(id);
    return this.getAllRecords<IGithubIssuesRepo>(path);
  }
  public async getAllMembersByOrgId(id: number) {
    const path = GITHUB_ISSUES_PATH.ORG_MEMBERS(id);
    return this.getAllRecords<IGithubIssuesMember>(path);
  }
  protected async sendGetRequest<T>(path: string, queryParams?: IGithubIssueQueryParams) {
    return this.get<T>({
      path,
      queryParams,
    });
  }
}
