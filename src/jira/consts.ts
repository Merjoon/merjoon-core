import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: 'description',
    remote_created_at: 'created-on',
    remote_modified_at: 'last-changed-on',
  },
  users: {
    id: 'UUID("accountId")',
    remote_id: 'accountId',
    name: 'displayName',
    email_address: 'emailAddress',
    remote_created_at: '',
    remote_modified_at: '',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'fields->issuetype->name',
    '[assignees]': 'fields->assignee->UUID("accountId")',
    status: 'fields->status->name',
    description: 'fields->STRINGIFY("description")',
    '[projects]': 'fields->project->UUID("id")',
    remote_created_at: 'fields->created',
    remote_modified_at: 'fields->updated',
  },
}

