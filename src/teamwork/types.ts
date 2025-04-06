export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
  maxSockets: number;
  limit: number;
}
export interface ITeamworkQueryParams {
  page?: number;
  pageSize?: number;
  include?: string;
}

export enum TeamworkApiPath {
  People = 'people',
  Projects = 'projects',
  Tasks = 'tasks',
}

export interface ITeamworkPeople {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamworkProject {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamworkTask {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  assigneeUsers: ITeamworkItem[];
  projectId?: number;
}
export interface ITeamworkItem {
  id: number;
  type: string;
}

export type ITeamworkIncludedEntity = ITeamworkProject | ITeamworkTask | ITeamworkPeople;

export type ITeamworkEntity =
  | ITeamworkItem
  | ITeamworkResponseIncludedCard
  | ITeamworkResponseIncludedColumn
  | ITeamWorkIncludedUser
  | ITeamworkProject
  | ITeamworkTask
  | ITeamworkPeople;

type ITeamWorkResponseIncludedCards = Record<
  string,
  {
    id: number;
    displayOrder: number;
    archived: string;
    archivedAt: null;
    createdAt: string;
    column: ITeamworkItem;
  }
>;
interface ITeamworkResponseIncludedCard {
  id: number;
  displayOrder: number;
  archived: string;
  archivedAt: null;
  createdAt: string;
  column: ITeamworkItem;
}
type ITeamWorkResponseIncludedColumns = Record<
  string,
  {
    id: number;
    name: string;
    color: string;
    displayOrder: number;
    createdAt: string;
    deletedAt: null;
    project: ITeamworkItem;
  }
>;
interface ITeamworkResponseIncludedColumn {
  id: number;
  name: string;
  color: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  sort: string;
  sortOrder: string;
  deletedAt: null;
  project: ITeamworkItem;
}
type ITeamWorkResponseIncludedUsers = Record<
  string,
  {
    id: number;
    firstName: string;
    lastName: string;
  }
>;
export interface ITeamWorkIncludedUser {
  id: number;
  firstName?: string;
  lastName?: string;
}
export interface ITeamworkResponseIncluded {
  cards?: ITeamWorkResponseIncludedCards;
  columns?: ITeamWorkResponseIncludedColumns;
  users?: ITeamWorkResponseIncludedUsers;
}
export interface ITeamworkPage {
  pageOffset: number;
  pageSize: number;
  count: number;
  hasMore: boolean;
}
export interface ITeamworkResponseMeta {
  page: ITeamworkPage;
}

export interface ITeamworkResponse {
  projects?: ITeamworkProject[];
  tasks?: ITeamworkTask[];
  people?: ITeamworkPeople[];
  included: ITeamworkResponseIncluded;
  meta: ITeamworkResponseMeta;
}

export type ITeamworkValue = string | number | undefined | null | ITeamworkItem;
