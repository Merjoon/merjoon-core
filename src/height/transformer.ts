import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IHeightList, IHeightTask, IHeightTransformConfig, IHeightUser } from './types';

export class HeightTransformer extends MerjoonTransformer<IHeightTransformConfig> {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformUsers(data: IHeightUser[]) {
    return this.transform(data, this.config.users);
  }
  transformTasks(data: IHeightTask[]) {
    return this.transform(data, this.config.tasks);
  }
  transformLists(data: IHeightList[]) {
    return this.transform(data, this.config.projects);
  }
}
