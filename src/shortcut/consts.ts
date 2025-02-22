import {ShortcutApiPath} from './types';
import {IMerjoonTransformConfig} from '../common/types';

export const SHORTCUT_PATHS = {
  MEMBERS: ShortcutApiPath.Members,
  SEARCH: ShortcutApiPath.Search,
  STORIES: ShortcutApiPath.Stories,
  WORKFLOWS: ShortcutApiPath.Workflows,
};
export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    remote_created_at: 'created_at',
    remote_modified_at: 'updated_at',
    name: 'profile->name',
    email_address: 'profile->email_address',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'STRING("id")',
    name: 'name',
    '[assignees]': '[owner_id]->UUID("id")',
    status: 'state_name',
    description: 'description',
    '[projects]': '',
    remote_created_at: 'TIMESTAMP("created_at")',
    remote_modified_at: 'TIMESTAMP("updated_at")',
    ticket_url: 'app_url'
  },
};
