export interface IJiraConfig {
  token: string,
  subdomain: string,
  email: string,
  pageSize?: number
}

export enum JiraApiPath {
  UsersSearch = '/users/search',
  ProjectSearch = '/project/search',
  Search = '/search',
}

export interface IJiraQueryParams {
  startAt: number;
  maxResults: number;
}

export interface IJiraProjectsResponse {
  values: IJiraProject[]
}

export type IJiraUsersResponse = IJiraUser[]
export interface IJiraIssuesResponse {
  issues: IJiraIssue[]
}
export interface IJiraProject {
  id: string,
  name: string,
}

export interface IJiraIssue {
  id: string,
  fields: IJiraIssueFields,
  descriptionStr: string
}

export interface IJiraUser {
  accountId: string,
  accountType: string,
  emailAddress: string,
  displayName: string,
}

export interface IJiraIssueFields {
  issuetype: IJiraIssueFieldsIssuetype,
  assignee: IJiraIssueFieldsAssignee,
  status: IJiraIssueFieldsStatus,
  description: IJiraIssueFieldsDescription,
  descriptionStr: string,
  project: IJiraIssueFieldsProject,
  created: string,
  updated: string,
}

export interface IJiraIssueFieldsIssuetype {
  name: string
}

export interface IJiraIssueFieldsAssignee {
  accountId: string
}

export interface IJiraIssueFieldsStatus {
  name: string
}

export interface IJiraIssueFieldsDescription {
  type: string,
  version: number,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  content: any[]  
}

export interface IJiraIssueFieldsProject {
  id: string
}

export enum GetJiraEntity {
  Issues = 'getIssues',
  Projects = 'getProjects',
  Users = 'getUsers'
}

export type JiraEntity = IJiraProject | IJiraUser | IJiraIssue;