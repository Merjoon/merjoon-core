import { IJiraTransformConfig, JiraApiPath } from './types';

export const TRANSFORM_CONFIG: IJiraTransformConfig = {
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
    description: 'renderedFields->HTML_TO_STRING("description")',
    '[projects]': 'fields->project->UUID("id")',
    remote_created_at: 'fields->TIMESTAMP("created", "$$iso")',
    remote_modified_at: 'fields->TIMESTAMP("updated", "$$iso")',
    ticket_url: 'self',
  },
};

export const JIRA_PATHS = {
  USERS: `${JiraApiPath.Users}/${JiraApiPath.Search}`,
  PROJECT: `${JiraApiPath.Project}/${JiraApiPath.Search}`,
  ISSUES: `${JiraApiPath.Search}/${JiraApiPath.JQL}`,
};
