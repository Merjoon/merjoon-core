import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import {
  IClickUpMembers,
  IClickUpTasks,
  IClickUpLists,
  IClickUpComments,
  IClickupTransformConfig,
} from './types';
import { IMerjoonUsers, IMerjoonTasks, IMerjoonProjects, IMerjoonComments } from '../common/types';

export class ClickUpTransformer extends MerjoonTransformer<IClickupTransformConfig> {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformMembers(data: IClickUpMembers): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }

  transformTasks(data: IClickUpTasks): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }

  transformLists(data: IClickUpLists): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }

  transformComments(data: IClickUpComments): IMerjoonComments {
    return this.transform(data, this.config.comments);
  }
}
