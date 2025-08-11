export interface ITrelloConfig {
  limit: number;
  key: string;
  token: string;
}

export interface ITrelloQueryParams {
  limit: number;
  before?: string;
}

export enum TrelloApiPath {
  Organizations = 'organizations',
  Me = 'me',
  Boards = 'boards',
  Members = 'members',
  Cards = 'cards',
  Lists = 'lists',
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
  list?: ITrelloList;
}

export interface ITrelloList {
  id: string;
  name: string;
}

export interface ITrelloItem {
  id: string;
}
