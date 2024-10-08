import { MerjoonTransformer } from "../common/MerjoonTransformer";
import { TRANSFORM_CONFIG } from "./consts";
import { IHeightList, IHeightTask, IHeightUser } from "./types";

export class HeightTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformPeople(data: IHeightUser[]) {
    return this.transform(data, this.config.users);
  }
  transformTasks(data: IHeightTask[]) {
    return this.transform(data, this.config.tasks);
  }
  transformProjects(data: IHeightList[]) {
    return this.transform(data, this.config.projects);
  }
}
