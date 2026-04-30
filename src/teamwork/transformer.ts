import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import {
  ITeamworkComment,
  ITeamworkPeople,
  ITeamworkProject,
  ITeamworkTask,
  ITeamworkTransformConfig,
} from './types';

export class TeamworkTransformer extends MerjoonTransformer<ITeamworkTransformConfig> {
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
  transformComments(data: ITeamworkComment[]) {
    return this.transform(data, this.config.comments);
  }
}
