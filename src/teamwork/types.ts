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

export const RESULT_KEY ={
  [TeamworkApiPath.People]: 'people',
  [TeamworkApiPath.Projects]: 'projects',
  [TeamworkApiPath.Tasks]: 'todo-items',
}

export interface ITeamworkPeople {
  // TODO FILL
}

export interface ITeamworkProject {
  // TODO FILL
}

export interface ITeamworkTask {
  // TODO FILL
}
