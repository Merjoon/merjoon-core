import { MerjoonTransformer } from '../common/MerjoonTransformer';
import { TRANSFORM_CONFIG } from './consts';
import { IShortcutMember, IShortcutStory, IShortcutTransformConfig } from './types';

export class ShortcutTransformer extends MerjoonTransformer<IShortcutTransformConfig> {
  constructor() {
    super(TRANSFORM_CONFIG);
  }
  transformMembers(data: IShortcutMember[]) {
    return this.transform(data, this.config.users);
  }
  transformStories(data: IShortcutStory[]) {
    return this.transform(data, this.config.tasks);
  }
}
