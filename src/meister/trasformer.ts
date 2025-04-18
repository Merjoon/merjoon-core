import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './const';
import { IMeisterPerson, IMeisterProject, IMeisterTask } from './type';

export class MeisterTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformProjects(data: IMeisterProject[]) {
    return this.transform(data, this.config.projects);
  }
  transformTasks(data: IMeisterTask[]) {
    return this.transform(data, this.config.tasks);
  }
  transformPersons(data: IMeisterPerson[]) {
    return this.transform(data, this.config.users);
  }
}
