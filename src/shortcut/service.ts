import { IMerjoonService,IMerjoonUsers,IMerjoonTasks} from '../common/types';
import {ShortcutApi} from './api';
import {ShortcutTransformer} from './transformer';

export class ShortcutService implements IMerjoonService {
  constructor(public readonly api: ShortcutApi, public readonly transformer: ShortcutTransformer) {}

  public async init(){
    return;
  }

  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getMembers();
    return this.transformer.transformMembers(users);
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    const [stories, workflows] = await Promise.all([
      this.api.getAllStories(),
      this.api.getWorkflows()
    ]);

    const tasks = stories.map(story => {
      const workflow = workflows.find(workflow => workflow.id === story.workflow_id);
      const stateName = workflow?.states.find(state => state.id === story.workflow_state_id)?.name ?? 'Unknown State';

      return {
        ...story,
        state_name: stateName
      };
    });

    return this.transformer.transformStories(tasks);
  }
}
