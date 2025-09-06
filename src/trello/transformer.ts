import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { ITrelloCard, ITrelloBoard, ITrelloMember } from './types';
import { IMerjoonProjects, IMerjoonTasks, IMerjoonUsers } from '../common/types';

export class TrelloTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: ITrelloMember[]): IMerjoonUsers {
    return this.transform(data, this.config.users);
  }

  transformTasks(data: ITrelloCard[]): IMerjoonTasks {
    return this.transform(data, this.config.tasks);
  }

  transformProjects(data: ITrelloBoard[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
