import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './const';
import { IMeisterPerson, IMeisterProject, IMeisterTask, IMeisterTransformConfig } from './type';

export class MeisterTransformer extends MerjoonTransformer<IMeisterTransformConfig> {
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
