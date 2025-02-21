import {
  MerjoonTransformer
} from '../common/MerjoonTransformer';
import {
  TRANSFORM_CONFIG
} from './consts';
import {
  IClickUpMembers, IClickUpTasks, IClickUpLists
} from './types';
import {
  IMerjoonUsers, IMerjoonTasks, IMerjoonProjects
} from '../common/types';

export class ClickUpTransformer extends MerjoonTransformer {
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
}
