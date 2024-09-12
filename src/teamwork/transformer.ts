import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import {addTimestamps} from "./addTimestamps";

export class TeamworkTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformPeople(data: any[]) {
    return addTimestamps(this.transform(data, this.config.users))
  }
  transformTasks(data: any[]) {
    return addTimestamps(this.transform(data, this.config.tasks))
  }
  transformProjects(data: any[]) {
    return addTimestamps(this.transform(data, this.config.collections))
  }
}
