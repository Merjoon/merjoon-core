//@ts-nocheck
import { IMerjoonProjects, IMerjoonService, IMerjoonTasks, IMerjoonUsers } from "../common/types";
import { JiraApi } from "./api";
import { JiraTransformer } from "./transformer";
import {JiraApiPath } from "./types"


export class JiraService implements IMerjoonService {
  constructor(public readonly api: JiraApi, public readonly transformer: JiraTransformer) {}

  protected async* getAllRecordsIterator<T>(path: JiraApiPath, pageSize = 50) {
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

  protected async getAllRecords<T>(path: JiraApiPath, pageSize = 50): Promise<T[]> {
      const iterator: AsyncGenerator<T[]> = this.getAllRecordsIterator<T>(path, pageSize);
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
      return people
    }
  
    public async getTasks(): Promise<IMerjoonTasks> {
      const tasks = await this.getAllRecords<IMerjoonTasks>(JiraApiPath.Tasks); // TODO: fix types, add transformer
      return tasks
    }
}
