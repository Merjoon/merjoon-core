import { TrelloApiPath } from './types';
import { IMerjoonTransformConfig } from '../common/types';

export const TRELLO_PATHS = {
  ORGANIZATIONS: `${TrelloApiPath.Members}/${TrelloApiPath.Me}/${TrelloApiPath.Organizations}`,
  BOARDS: (organizationId: string) =>
    `${TrelloApiPath.Organizations}/${organizationId}/${TrelloApiPath.Boards}`,
  MEMBERS: (organizationId: string) =>
    `${TrelloApiPath.Organizations}/${organizationId}/${TrelloApiPath.Members}`,
  CARDS: (boardId: string) => `${TrelloApiPath.Boards}/${boardId}/${TrelloApiPath.Cards}`,
  LISTS: (boardId: string) => `${TrelloApiPath.Boards}/${boardId}/${TrelloApiPath.Lists}`,
};
export const TRANSFORM_CONFIG: IMerjoonTransformConfig = {
  projects: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    remote_modified_at: 'TIMESTAMP("dateLastActivity")',
    description: 'desc',
  },
  users: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'fullName',
  },
  tasks: {
    id: 'UUID("id")',
    remote_id: 'id',
    name: 'name',
    '[assignees]': '[UUID("idMembers")]',
    status: 'list->name',
    description: 'desc',
    '[projects]': 'UUID("idBoard")',
    remote_modified_at: 'TIMESTAMP("dateLastActivity")',
    ticket_url: 'url',
  },
};
