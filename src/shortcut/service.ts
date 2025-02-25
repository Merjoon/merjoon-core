import { IMerjoonService, IMerjoonUsers, IMerjoonTasks, IMerjoonProjects } from '../common/types';
import { ShortcutApi } from './api';
import { ShortcutTransformer } from './transformer';
import { IShortcutStory, IShortcutWorkflow } from './types';

export class ShortcutService implements IMerjoonService {
  workflows:IShortcutWorkflow[] = [];
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
    const workflows = await this.api.getWorkflows();
    this.workflows = workflows.map(({ id, states }) => ({ id, states }));
    return this.workflows;
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    await this.getWorkflows();

    const stories = await this.getAllStories();

    stories.forEach(story => {
      const workflow = this.getWorkflowById(story.workflow_id);
      story.workflow_state_name = this.getWorkflowStateName(workflow, story.workflow_state_id);
    });

    return this.transformer.transformStories(stories);
  }

  private getWorkflowById(workflowId: number) {
    return this.workflows.find(workflow => workflow.id === workflowId);
  }

  private getWorkflowStateName(workflow: IShortcutWorkflow | undefined, stateId: number){
    return workflow?.states.find(state => state.id === stateId)?.name;
  }
}