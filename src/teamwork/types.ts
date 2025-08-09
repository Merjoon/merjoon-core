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
  crmDealIds: string[] | null;
  assigneeUsers: ITeamworkModel[];
  projectId?: number;
  card: ITeamworkModel;
}
export interface ITeamworkModel {
  id: number;
  type: keyof ITeamworkResponseIncluded;
}

export interface ITeamworkItem {
  id: number;
}

export type ITeamworkEntity =
  | ITeamworkModel
  | ITeamworkCard
  | ITeamworkColumn
  | ITeamworkPeople
  | ITeamworkProject
  | ITeamworkTask;

interface ITeamworkCard {
  id: number;
  displayOrder: number;
  archived: string;
  archivedAt: string | null;
  createdAt: string;
  column: ITeamworkModel;
}
interface ITeamworkColumn {
  id: number;
  name: string;
  color: string;
  displayOrder: number;
  createdAt: string;
  deletedAt: string | null;
  project: ITeamworkModel;
}
export interface ITeamworkResponseIncluded {
  cards?: Record<string, ITeamworkCard>;
  columns?: Record<string, ITeamworkColumn>;
  users?: Record<string, ITeamworkPeople>;
  projects?: Record<string, ITeamworkProject>;
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

export type ITeamworkEntityArrayItem = ITeamworkEntity | number;

export interface ITeamworkResponse {
  projects?: ITeamworkProject[];
  tasks?: ITeamworkTask[];
  people?: ITeamworkPeople[];
  included?: ITeamworkResponseIncluded;
  meta: ITeamworkResponseMeta;
}

export type ITeamworkValue = string | number | undefined | null | ITeamworkModel;
