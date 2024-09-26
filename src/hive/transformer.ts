import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import {IHivePeople, IHiveTask, IHiveProject} from "./types";
import {IMerjoonUsers, IMerjoonTasks, IMerjoonProjects} from "../common/types";

export class HiveTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformPeople(data: IHivePeople[]): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }
  transformTasks(data: IHiveTask[]): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }
  transformProjects(data: IHiveProject[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
