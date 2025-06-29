import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { ITodoistTask, ITodoistProject, ITodoistCollaborator } from './types';

export class TodoistTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformUsers(data: ITodoistCollaborator[]) {
    return this.transform(data, this.config.users);
  }
  transformTasks(data: ITodoistTask[]) {
    return this.transform(data, this.config.tasks);
  }
  transformProjects(data: ITodoistProject[]) {
    return this.transform(data, this.config.projects);
  }
}
