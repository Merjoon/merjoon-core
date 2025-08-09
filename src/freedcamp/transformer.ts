import { TRANSFORM_CONFIG } from './consts';
import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { IFreedcampProject, IFreedcampTask, IFreedcampUser } from './types';

export class FreedcampTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformUsers(data: IFreedcampUser[]): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }

  transformTasks(data: IFreedcampTask[]): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }

  transformProjects(data: IFreedcampProject[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
