//@ts-nocheck
import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from "../common/types";
import { JiraApi } from "./api";
import { JiraTransformer } from "./transformer";
import {JiraApiPath } from "./types"


export class JiraService implements IMerjoonService {
  constructor(public readonly api: JiraApi, public readonly transformer: JiraTransformer) {}

  protected async* getAllProjectsIterator<T>(path: JiraApiPath, pageSize = 1) {
      let currentPage = 0;
      let isLast = false;

      do {
          try {
              const response = await this.api.sendGetRequest(path, {
                  startAt: currentPage * pageSize,
                  maxResults: pageSize
              });
              const data: T[] = response.values;
              yield data;

              isLast = response.isLast || (data.length < pageSize);
              currentPage++;

          } catch (e: any) {
              throw new Error(e.message);
          }
      } while (!isLast);
  }

  protected async* getAllIssuesIterator<T>(path: JiraApiPath, pageSize = 2) {
    let currentPage = 0;
    let isLast = false;

    do {
        try {
            const response = await this.api.sendGetRequest(path, {
                startAt: currentPage * pageSize,
                maxResults: pageSize
            });
            const data: T[] = response.issues;
            yield data;

            isLast = response.isLast || (data.length < pageSize);
            currentPage++;

        } catch (e: any) {
            throw new Error(e.message);
        }
    } while (!isLast);
  }

  protected async* getAllUsersIterator<T>(path: JiraApiPath, pageSize = 2) {
    let currentPage = 0;
    let isLast = false;

    do {
        try {
            const response = await this.api.sendGetRequest(path, {
                startAt: currentPage * pageSize,
                maxResults: pageSize
            });
            const data: T[] = response;
            const users = data.filter(user => user.accountType === "atlassian")
            yield users;

            isLast = data.length < pageSize;
            currentPage++;

        } catch (e: any) {
            throw new Error(e.message);
        }
    } while (!isLast);
  }

  protected async getAllRecords<T>(path: JiraApiPath, pageSize = 2): Promise<T[]> {
    const iterator: AsyncGenerator<T[]> = path === '/search' ? this.getAllIssuesIterator<T>(path, pageSize) : path === "users/search" ? this.getAllUsersIterator<T>(path, pageSize) : this.getAllProjectsIterator<T>(path, pageSize)
    let records: T[] = [];

    for await (const nextChunk of iterator) {
        records = records.concat(nextChunk);
    }

    return records;
}

  public async getProjects(): Promise<IMerjoonProjects> {
      const projects = await this.getAllRecords<IMerjoonProjects>(JiraApiPath.Projects);  // TODO: fix types
      return this.transformer.transformProjects(projects);
  }

  public async getUsers(): Promise<IMerjoonUsers> {
      const people = await this.getAllRecords<IMerjoonUsers>(JiraApiPath.Users); // TODO: fix types, add transformer
      return this.transformer.transformPeople(people);
    }
  
    public async getTasks(): Promise<IMerjoonTasks> {
      const tasks = await this.getAllRecords<IMerjoonTasks>(JiraApiPath.Tasks); // TODO: fix types, add transformer
      return this.transformer.transformTasks(tasks);
    }
}
// TODO: get creat and update dates of project with another request for each of them
// TODO: change getAllRecordsIterator method, 
// TODO: assignees
// TODO: types, tests

