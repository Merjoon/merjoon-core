import { TrelloApiPath } from './types';

export const TRELLO_PATHS = {
  BOARDS: `${TrelloApiPath.Members}/me/${TrelloApiPath.Boards}`,
  MEMBERS: (boardId: string) => `${TrelloApiPath.Boards}/${boardId}/${TrelloApiPath.Members}`,
  CARDS: (boardId: string) => `${TrelloApiPath.Boards}/${boardId}/${TrelloApiPath.Cards}`,
  LISTS: (cardId: string) => `${TrelloApiPath.Cards}/${cardId}/${TrelloApiPath.List}`,
};
