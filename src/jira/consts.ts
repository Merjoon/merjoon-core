import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    description: '',
    remote_created_at: '',
    remote_modified_at: '',
  },
  users: {
    id: 'UUID("accountId")',
    remote_id: 'accountId',
    name: 'displayName',
    email_address: 'emailAddress',
    remote_created_at: '',
    remote_modified_at: '',
  },
  tasks: {   // TODO: assignees
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'fields->issuetype->name',
    '[assignees]': 'fields->assignee->accountId',
    status: 'fields->status->name',
    description: 'descriptionStr',
    '[projects]': 'fields->project->UUID("id")',
    remote_created_at: 'fields->created',
    remote_modified_at: 'fields->updated',
  },
}