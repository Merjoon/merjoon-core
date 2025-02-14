import {ShortcutApi} from '../api';
import {IShortcutConfig} from '../types';

describe('e2e ShortcutApi', () => {
  let api: ShortcutApi;
  const config: IShortcutConfig= {
    token:process.env.SHORTCUT_TOKEN ?? '',
  };

  beforeEach(() => {
    api = new ShortcutApi(config);
  });

  it('getMembers', async () => {
    const members = await api.getAllMembers();

    expect(members[0]).toEqual(expect.objectContaining({
      id: expect.any(String),
      profile: expect.objectContaining({
        name: expect.any(String),
        email_address: expect.any(String),
      }),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    }));
  });

  it('getStories', async () => {
    const stories = await api.getAllStories();

    expect(stories[0]).toEqual(expect.objectContaining({
      id:expect.any(Number),
      name: expect.any(String),
      owner_ids:expect.any(Array),
      description:expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      app_url:expect.any(String),
    }));
  });

  it('getWorkflows', async () => {
    const workflows = await api.getAllWorkflows();
    const stories = await api.getAllStories();
    const storiesWithStateNames = stories.map(story => {
      let workflowFound;
      let stateFound;

      for (const workflow of workflows) {
        if (workflow.id === story.workflow_id) {
          workflowFound = workflow;
          break;
        }
      }

      if (workflowFound) {
        for (const state of workflowFound.states) {
          if (state.id === story.workflow_state_id) {
            stateFound = state.name;
            break;
          }
        }
      }

      return {
        ...story,
        workflow_state_name: stateFound,
      };
    });

    // console.log(storiesWithStateNames);
    console.log(storiesWithStateNames.length);
  });
});