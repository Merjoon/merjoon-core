import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';

export class TeamworkTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  transformPeople(data: any[]) {
    return this.transform(data, this.config.users);
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  transformTasks(data: any[]) {
    return this.transform(data, this.config.tasks);
  }
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  transformProjects(data: any[]) {
    return this.transform(data, this.config.projects);
  }
}
