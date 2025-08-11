import { TrelloApiPath } from './types';

export const TRELLO_PATHS = {
  ORGANIZATIONS: `${TrelloApiPath.Members}/${TrelloApiPath.Me}/${TrelloApiPath.Organizations}`,
  BOARDS: (organizationId: string) =>
    `${TrelloApiPath.Organizations}/${organizationId}/${TrelloApiPath.Boards}`,
  MEMBERS: (organizationId: string) =>
    `${TrelloApiPath.Organizations}/${organizationId}/${TrelloApiPath.Members}`,
  CARDS: (boardId: string) => `${TrelloApiPath.Boards}/${boardId}/${TrelloApiPath.Cards}`,
  LISTS: (boardId: string) => `${TrelloApiPath.Boards}/${boardId}/${TrelloApiPath.Lists}`,
};
