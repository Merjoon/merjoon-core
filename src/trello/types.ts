export interface ITrelloConfig {
  limit: number;
  apiKey: string;
  token: string;
}

export interface ITrelloQueryParams {
  limit?: number;
  before?: string;
  sort?: string;
  lists?: string;
}

export enum TrelloApiPath {
  Organizations = 'organizations',
  Me = 'me',
  Boards = 'boards',
  Members = 'members',
  Cards = 'cards',
}

export interface ITrelloBoard {
  id: string;
  name: string;
  desc: string;
  dateLastActivity: number;
  lists: ITrelloList[];
}

export interface ITrelloMember {
  id: string;
  fullName: string;
}

export interface ITrelloCard {
  id: string;
  name: string;
  idMembers: string[];
  idList: string;
  desc: string;
  url: string;
}

export interface ITrelloList {
  id: string;
  name: string;
}

export interface ITrelloItem {
  id: string;
}
