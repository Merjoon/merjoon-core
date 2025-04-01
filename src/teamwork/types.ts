
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
export interface ITeamworkItem {
  id?: number;
  type?: string;
}

export interface IPageMeta {
  page: {
    pageOffset: number;
    pageSize: number;
    count: number;
    hasMore: boolean;
  };
}

export interface ITeamworkCommon {
  id: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  type?: string;
}

export type MyInterface = Record<string, object | ITeamworkItem | ITeamworkPeople | ITeamworkProject | ITeamworkTask | string | number | boolean | null>;


type IncludedData = Record<string, Record<string, MyInterface>>;

export interface IDataType {
  projects?: MyInterface[];
  tasks?: MyInterface[];
  people?: MyInterface[];
  included?: IncludedData;
  meta: IPageMeta;
}
