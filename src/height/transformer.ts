import { MerjoonTransformer } from "../common/MerjoonTransformer";
import { TRANSFORM_CONFIG } from "./consts";
import { IHeightUser } from "./types";

export class HeightTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformPeople(data: IHeightUser[]) {
    return this.transform(data, this.config.users);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformTasks(data: any[]) {
    return this.transform(data, this.config.tasks);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformProjects(data: any[]) {
    return this.transform(data, this.config.projects);
  }
}
