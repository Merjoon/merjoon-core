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
  | ITeamworkIncludedCard
  | ITeamworkIncludedColumn
  | ITeamWorkIncludedUser
  | ITeamworkProject
  | ITeamworkTask
  | ITeamworkPeople;

type ITeamWorkIncludedCards = Record<
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
interface ITeamworkIncludedCard {
  id: number;
  displayOrder: number;
  archived: string;
  archivedAt: null;
  createdAt: string;
  column: ITeamworkItem;
}
type ITeamWorkIncludedColumns = Record<
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
interface ITeamworkIncludedColumn {
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
type ITeamWorkIncludedUsers = Record<
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
  cards?: ITeamWorkIncludedCards;
  columns?: ITeamWorkIncludedColumns;
  users?: ITeamWorkIncludedUsers;
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
