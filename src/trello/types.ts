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
  lists?: ITrelloList[];
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
  list?: ITrelloList;
}

export interface ITrelloList {
  id: string;
  name: string;
}

export interface ITrelloOrganization {
  id: string;
}

export interface ITrelloItem {
  id: string;
}
