import {IMerjoonService, IMerjoonUsers, IMerjoonTasks, IMerjoonProjects} from '../common/types';
import {ShortcutApi} from './api';
import {ShortcutTransformer} from './transformer';
import {IShortcutStory, IShortcutWorkflow} from './types';

export class ShortcutService implements IMerjoonService {
  workflows:IShortcutWorkflow[]=[];
  constructor(public readonly api: ShortcutApi, public readonly transformer: ShortcutTransformer) {}

  public async init(){
    return;
  }

  public async getProjects(): Promise<IMerjoonProjects> {
    return [] as IMerjoonProjects;
  }
  
  public async getUsers(): Promise<IMerjoonUsers> {
    const users = await this.api.getMembers();
    return this.transformer.transformMembers(users);
  }

  public async getAllStories(): Promise<IShortcutStory[]> {
    return this.api.getAllStories();
  }

  public async getWorkflows(): Promise<IShortcutWorkflow[]> {
    this.workflows = await this.api.getWorkflows();
    return this.workflows;
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (this.workflows.length === 0) {
      await this.getWorkflows();
    }

    const stories = await this.getAllStories();

    const tasks = stories.map(story => {
      const workflow = this.workflows.find(workflow => workflow.id === story.workflow_id);
      const workflowStateName = workflow?.states.find(state => state.id === story.workflow_state_id)?.name;

      return {
        ...story,
        workflow_state_name: workflowStateName,
      };
    });

    return this.transformer.transformStories(tasks);
  }
}