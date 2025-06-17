import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import type { ITodoistProject } from './types';
import type { IMerjoonProjects } from '../common/types';

export class TodoistTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformProjects(data: ITodoistProject[]): IMerjoonProjects {
    return this.transform(data, this.config.projects);
  }
}
