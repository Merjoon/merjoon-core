export interface ITrelloConfig {
  limit: number;
  key: string;
  token: string;
}
export interface ITrelloQueryParams extends ITrelloConfig {
  before?: string;
}
export enum TrelloApiPath {
  Boards = 'boards',
  Members = 'members',
  Cards = 'cards',
  List = 'list',
}

export interface ITrelloBoard {
  id: string;
  name: string;
  desc: string;
  dateLastActivity: number;
}

export interface ITrelloMember {
  id: string;
  fullName: string;
}

export interface ITrelloCard {
  id: string;
  name: string;
  idMembers: string[];
  desc: string;
  dateLastActivity: number;
  url: string;
}

export interface ITrelloList {
  id: string;
  name: string;
}
export interface ITrelloItem {
  id: string;
}
