import { IMerjoonTransformConfig } from '../common/types';

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
    projects: {
        id: 'UUID("id")',
        remote_id: 'STRING("id")',
        name: 'name',
        description: 'content',
    },
    users: {
        id: 'UUID("id")',
        remote_id: 'STRING("id")',
        name: 'username',
        email_address: 'email',
    },
    tasks: {
        id: 'UUID("id")',
        remote_id: 'STRING("id")',
        name: 'name',
        '[assignees]': '[assignees]->UUID("id")',
        status: 'status->status',
        description: 'description',
        '[projects]': 'list->UUID("id")',
        remote_created_at: 'date_created',
        remote_modified_at: 'date_updated',
    },
}
