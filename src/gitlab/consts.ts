import { GitLabApiPath } from './types';
import { IMerjoonTransformConfig } from '../common/types';
export const TRANSFORM_CONFIG:IMerjoonTransformConfig = {
  projects:{
    id:'UUID("id")',
    remote_id:'id',
    name:'name',
    remote_created_at:'TIMESTAMP("created_at")',
    description:'description',
    remote_modified_at:'TIMESTAMP("updated_at")'
  },
  users:{
    id:'UUID("id")',
    remote_id:'id',
    name:'name',
  },
  tasks:{
    id:'UUID("id")',
    remote_id:'id',
    name:'title',
    '[assignees]': '[assignees]->UUID("id")',
    status:'state',
    '[projects]': 'UUID("project_id")',
    description:'description',
    remote_created_at:'TIMESTAMP("created_at")',
    remote_modified_at:'TIMESTAMP("updated_at")',
    ticket_url:'web_url',
  }
};

export const GITLAB_PATH = {
  ISSUES: GitLabApiPath.Issues,
  PROJECTS: GitLabApiPath.Projects,
  GROUPS: GitLabApiPath.Groups,
  MEMBERS: (id: string): string => {
    return `${GitLabApiPath.Groups}/${id}/${GitLabApiPath.Members}`;
  },
};
