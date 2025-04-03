export interface ITeamworkConfig {
  token: string;
  password: string;
  subdomain: string;
  limit: number;
}

export interface ITeamworkQueryParams {
  page?: number;
  pageSize?: number;
  include?: 'cards.columns';
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

type ITeamworkItemType = 'cards' | 'columns' | 'users' | string;
export interface ITeamworkItem {
  id: number;
  type: ITeamworkItemType;
}
export interface IPageMeta {
  page: {
    pageOffset: number;
    pageSize: number;
    count: number;
    hasMore: boolean;
  };
}

export type IObject =
  | ITeamworkItem
  | ITeamWorkCards[string]
  | ITeamWorkCoulmns[string]
  | ITeamWorkUsers[string]
  | ITeamworkProject
  | ITeamworkTask
  | ITeamworkPeople;

type ITeamWorkCards = Record<
  string,
  {
    id: number;
    displayOrder: number;
    archived: string;
    archivedAt: null;
    archivedBy: null;
    createdAt: string;
    createBy: ITeamworkItem;
    updatedAt: string;
    visible: string;
    status: string;
    column: ITeamworkItem;
    deleteBy: null;
    deletedAt: null;
  }
>;

type ITeamWorkCoulmns = Record<
  string,
  {
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
>;
type ITeamWorkUsers = Record<
  string,
  {
    id: number;
    firstName: string;
    lastName: string;
  }
>;

export interface IncludedData {
  cards?: ITeamWorkCards;
  columns?: ITeamWorkCoulmns;
  users?: ITeamWorkUsers;
}
export interface IDataType {
  projects?: ITeamworkProject[];
  tasks?: ITeamworkTask[];
  people?: ITeamworkPeople[];
  included: IncludedData;
  meta: IPageMeta;
}
