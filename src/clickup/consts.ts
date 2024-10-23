import { IMerjoonTransformConfig } from '../common/types';
import { ClickUpApiPath } from "./types";

export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
    projects: {
        id: 'UUID("id")',
        remote_id: 'id',
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
        remote_id: 'id',
        name: 'name',
        '[assignees]': '[assignees]->UUID("id")',
        status: 'status->status',
        description: 'description',
        '[projects]': 'list->UUID("id")',
        remote_created_at: 'date_created',
        remote_modified_at: 'date_updated',
    },
};

export const CLICKUP_PATHS = {
    TEAMS: ClickUpApiPath.Team,
    SPACES: (id: string) => `${ClickUpApiPath.Team}/${id}/${ClickUpApiPath.Space}`,
    FOLDERS: (id: string) => `${ClickUpApiPath.Space}/${id}/${ClickUpApiPath.Folder}`,
    LISTS: (id: string) => `${ClickUpApiPath.Folder}/${id}/${ClickUpApiPath.List}`,
    FOLDERLESS_LISTS: (id: string) => `${ClickUpApiPath.Space}/${id}/${ClickUpApiPath.List}`,
    TASKS: (id: string) => `${ClickUpApiPath.List}/${id}/${ClickUpApiPath.Task}`,
};

