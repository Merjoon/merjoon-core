import { IBaseQueryParams, ResponseDataType } from '../common/types';

export interface IJiraConfig {
  token: string;
  subdomain: string;
  email: string;
  limit: number;
}

export enum JiraApiPath {
  UsersSearch = 'users/search',
  ProjectSearch = 'project/search',
  Search = 'search',
}

export type IJiraGetAllRecordsEntity<P extends JiraApiPath> = P extends JiraApiPath.ProjectSearch
  ? IJiraProject
  : P extends JiraApiPath.UsersSearch
    ? IJiraUser
    : P extends JiraApiPath.Search
      ? IJiraIssue
      : never;

export interface IJiraQueryParams extends IBaseQueryParams {
  startAt: number;
  maxResults: number;
}

export interface IJiraProject extends ResponseDataType {
  id: string;
  name: string;
}

export interface IJiraIssue extends ResponseDataType {
  id: string;
  fields: IJiraIssueFields;
}

export interface IJiraUser extends ResponseDataType {
  accountId: string;
  accountType: string;
  emailAddress: string;
  displayName: string;
}

export interface IJiraIssueFields {
  issuetype: IJiraIssueFieldsIssuetype;
  assignee: IJiraIssueFieldsAssignee;
  status: IJiraIssueFieldsStatus;
  description: object;
  descriptionStr: string;
  project: IJiraIssueFieldsProject;
  created: string;
  updated: string;
}

export interface IJiraIssueFieldsIssuetype {
  name: string;
}

export interface IJiraIssueFieldsAssignee {
  accountId: string;
}

export interface IJiraIssueFieldsStatus {
  name: string;
}

export interface IJiraIssueFieldsProject {
  id: string;
}

export interface IJiraResponseType<T> extends ResponseDataType {
  issues?: T[];
  values?: T[];
}
