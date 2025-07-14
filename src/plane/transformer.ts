import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IPlaneIssue, IPlaneProject, IPlaneUser } from './types';
import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../common/types';

export class PlaneTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: IPlaneUser[]): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }

  transformTasks(data: IPlaneIssue[]): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }

  transformProjects(data: IPlaneProject[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
