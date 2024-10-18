import { MerjoonTransformer } from "../common/MerjoonTransformer";
import { TRANSFORM_CONFIG } from "./consts"

export class JiraTransformer extends MerjoonTransformer {
    constructor() {
        super(TRANSFORM_CONFIG);
      }
      transformUsers(data: any[]) {
        return this.transform(data, this.config.users);
      }
      transformIssues(data: any[]) {
        return this.transform(data, this.config.tasks);
      }
      transformProjects(data: any[]) {
        return this.transform(data, this.config.projects);
      }
}