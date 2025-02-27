import { IMerjoonService, IMerjoonUsers, IMerjoonTasks, IMerjoonProjects } from '../common/types';
import { ShortcutApi } from './api';
import { ShortcutTransformer } from './transformer';
import { IShortcutStory, IShortcutWorkflowStateInfo } from './types';

export class ShortcutService implements IMerjoonService {
  workflowStates?: IShortcutWorkflowStateInfo[];
  constructor(public readonly api: ShortcutApi, public readonly transformer: ShortcutTransformer) {}

  public async init(){
    await this.getWorkflowStates();
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

  public async getWorkflowStates(): Promise<IShortcutWorkflowStateInfo[]> {
    const workflows = await this.api.getWorkflows();

    this.workflowStates = workflows.flatMap(workflow => {
      return workflow.states.map(state => {
        return {
          workflowId: workflow.id,
          stateId: state.id,
          name: state.name,
        };
      });
    });

    return this.workflowStates;
  }

  public async getTasks(): Promise<IMerjoonTasks> {
    if (!this.workflowStates ) {
      throw new Error('Missing workflowStates');
    }

    const stories = await this.getAllStories();

    stories.forEach(story => {
      story.workflow_state_name = this.getWorkflowStateName(
        story.workflow_id,
        story.workflow_state_id
      );
    });

    return this.transformer.transformStories(stories);
  }

  private getWorkflowStateName(workflowId: number, stateId: number) {
    const state = this.workflowStates?.find(state =>
      state.workflowId === workflowId && state.stateId === stateId
    );

    return state?.name;
  }
}