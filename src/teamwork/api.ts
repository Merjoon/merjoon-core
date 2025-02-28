import * as https from 'https';
import { ITeamworkConfig, ITeamworkPeople, ITeamworkProject, ITeamworkQueryParams, TeamworkApiPath, ITeamworkTask } from './types';
import { HttpClient } from '../common/HttpClient';
import { IMerjoonApiConfig } from '../common/types';
import { TEAMWORK_PATHS } from './consts';

export class TeamworkApi extends HttpClient {
  constructor(protected config: ITeamworkConfig) {
    const basePath = `https://${config.subdomain}.teamwork.com/projects/api/v3/`;

    const encodedCredentials = Buffer.from(`${config.token}:${config.password}`).toString('base64');

    const apiConfig: IMerjoonApiConfig = {
      baseURL: basePath,
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
      },
    };
    if (config.httpsAgent) {
      const agent = new https.Agent({
        keepAlive: true,
        maxSockets: config.httpsAgent.maxSockets,
      });
      apiConfig.httpsAgent = agent;
    }

    super(apiConfig);
  }

  protected async sendGetRequest(path: TeamworkApiPath, queryParams?: ITeamworkQueryParams) {
    const response = await this.get({
      path,
      queryParams,
    });
    return response;
  }

  protected async* getAllRecordsIterator(path: TeamworkApiPath, pageSize = 50) {
    let shouldStop = false;
    let currentPage = 1;
    do {
      const data = await this.sendGetRequest(path, {
        page: currentPage,
        pageSize,
      });

      yield data.projects || data.people || data.tasks;

      shouldStop = !data.meta.page.hasMore;
      currentPage++;
    } while (!shouldStop);
  }

  public async getAllRecords<T>(path: TeamworkApiPath, pageSize = 50): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator(path, pageSize);
    let records: T[] = [];

    for await (const nextChunk of iterator) {
      records = records.concat(nextChunk);
    }

    return records;
  }

  getAllProjects():Promise<ITeamworkProject[]> {
    return this.getAllRecords(TEAMWORK_PATHS.PROJECTS);
  }
  getAllUsers():Promise<ITeamworkPeople[]> {
    return this.getAllRecords(TEAMWORK_PATHS.USERS);
  }
  getAllIssues(projectId:number) {
    const path = TEAMWORK_PATHS.TASKS(projectId);
    return this.getAllRecords<ITeamworkTask>(path as TeamworkApiPath);
  }
}
