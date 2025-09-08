import { IShortcutTransformConfig, ShortcutApiPath } from './types';

export const SHORTCUT_PATHS = {
  MEMBERS: ShortcutApiPath.Members,
  SEARCH: ShortcutApiPath.Search,
  STORIES: ShortcutApiPath.Stories,
  WORKFLOWS: ShortcutApiPath.Workflows,
};
export const TRANSFORM_CONFIG: IShortcutTransformConfig = {
  projects: {
    id: '',
    remote_id: '',
    name: '',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    remote_created_at: 'TIMESTAMP("created_at", "$$iso")',
    remote_modified_at: 'TIMESTAMP("updated_at", "$$iso")',
    name: 'profile->name',
    email_address: 'profile->email_address',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': '[UUID("owner_ids")]',
    status: 'workflow_state_name',
    description: 'description',
    '[projects]': '',
    remote_created_at: 'TIMESTAMP("created_at", "$$iso")',
    remote_modified_at: 'TIMESTAMP("updated_at", "$$iso")',
    ticket_url: 'app_url',
  },
};
