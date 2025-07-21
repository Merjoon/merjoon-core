import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IShortcutMember, IShortcutStory } from './types';
import { IMerjoonUsers, IMerjoonTasks } from '../common/types';
import { toRecordString } from '../utils/toRecordString';

export class ShortcutTransformer extends MerjoonTransformer {
  constructor() {
    super(TRANSFORM_CONFIG);
  }

  transformMembers(data: IShortcutMember[]): IMerjoonUsers {
    return this.transform(data, toRecordString(this.config.users)) as IMerjoonUsers;
  }

  transformStories(data: IShortcutStory[]): IMerjoonTasks {
    return this.transform(data, toRecordString(this.config.tasks)) as IMerjoonTasks;
  }
}
