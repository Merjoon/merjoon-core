import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { ITodoistTask, ITodoistProject, ITodoistCollaborator } from './types';
import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../common/types';
import { toRecordString } from '../utils/toRecordString';

export class TodoistTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: ITodoistCollaborator[]): IMerjoonUsers {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }

  transformTasks(data: ITodoistTask[]): IMerjoonTasks {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }

  transformProjects(data: ITodoistProject[]): IMerjoonProjects {
    return this.transform(data, toRecordString(this.config.projects)) as IMerjoonProjects;
  }
}
