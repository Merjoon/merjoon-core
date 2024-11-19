import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
  },
  users: {
    id: 'UUID("accountId")',
    remote_id: 'accountId',
    name: 'displayName',
    email_address: 'emailAddress',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'fields->summary',
    '[assignees]': 'fields->assignee->UUID("accountId")',
    status: 'fields->status->name',
    description: 'fields->descriptionStr',
    '[projects]': 'fields->project->UUID("id")',
    remote_created_at: 'fields->TIMESTAMP("created")',
    remote_modified_at: 'fields->TIMESTAMP("updated")',
    ticket_url: 'self'
  },
};
