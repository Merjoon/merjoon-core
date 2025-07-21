import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './const';
import { IQuireUser, IQuireTask, IQuireProject } from './types';

export class QuireTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformProjects(data: IQuireProject[]) {
    return this.transform(data, this.config.projects);
  }
  transformTasks(data: IQuireTask[]) {
    return this.transform(data, this.config.tasks);
  }
  transformUsers(data: IQuireUser[]) {
    return this.transform(data, this.config.users);
  }
}
