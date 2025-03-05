import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { ITeamworkPeople, ITeamworkProject, ITeamworkTask } from './types';

export class TeamworkTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformPeople(data: ITeamworkPeople[]) {
    return this.transform(data, this.config.users);
  }
  transformTasks(data: ITeamworkTask[]) {
    return this.transform(data, this.config.tasks);
  }
  transformProjects(data: ITeamworkProject[]) {
    return this.transform(data, this.config.projects);
  }
}
