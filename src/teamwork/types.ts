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
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  hasDeskTickets: boolean;
  displayOrder: number;
  crmDealIds: null;
  assigneeUsers: ITeamworkItem[];
  projectId?: number;
  card: ITeamworkItem;
}
export interface ITeamworkItem {
  id: number;
  type: keyof ITeamworkResponseIncluded;
}

export type ITeamworkResponseEntity =
  | ITeamworkProject
  | ITeamworkTask
  | ITeamworkPeople
  | ITeamworkItem;

export type ITeamworkEntity =
  | ITeamworkItem
  | ITeamworkCard
  | ITeamworkColumn
  | ITeamworkUser
  | ITeamworkProject
  | ITeamworkTask
  | ITeamworkPeople;

interface ITeamworkCard {
  id: number;
  displayOrder: number;
  archived: string;
  archivedAt: null;
  createdAt: string;
  column: ITeamworkItem;
}
interface ITeamworkColumn {
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

export interface ITeamworkUser {
  id: number;
  firstName?: string;
  lastName?: string;
}
interface ITeamworkIncludedProject {
  id: number;
  type: string;
}
export interface ITeamworkResponseIncluded {
  cards?: Record<string, ITeamworkCard>;
  columns?: Record<string, ITeamworkColumn>;
  users?: Record<string, ITeamworkUser>;
  projects?: Record<string, ITeamworkIncludedProject>;
}
export interface ITeamworkResponseMetaPage {
  pageOffset: number;
  pageSize: number;
  count: number;
  hasMore: boolean;
}
export interface ITeamworkResponseMeta {
  page: ITeamworkResponseMetaPage;
}

export interface ITeamworkResponse {
  projects?: ITeamworkProject[];
  tasks?: ITeamworkTask[];
  people?: ITeamworkPeople[];
  included?: ITeamworkResponseIncluded;
  meta: ITeamworkResponseMeta;
}

export type ITeamworkValue = string | number | undefined | null | ITeamworkItem;
