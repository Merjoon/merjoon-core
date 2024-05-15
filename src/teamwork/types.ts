export type ITeamworkConfig = {
  token: string;
  password: string;
  subdomain: string;
}

export enum TeamworkApiPath {
  People = 'people.json',
  Projects = 'projects.json',
  Tasks = 'tasks.json',
}

export type IQueryParams = {
  page: number;
  pageSize: number;
}