import { IMerjoonTransformConfigBase } from '../common/types';

export interface IJiraConfig {
  token: string;
  subdomain: string;
  email: string;
  limit: number;
  maxSockets: number;
}

export enum JiraApiPath {
  Users = 'users',
  Project = 'project',
  Search = 'search',
  Jql = 'jql',
}

export interface IJiraIteratorQueryParams {
  startAt: number;
  maxResults: number;
}

export interface IJiraIssuesIteratorQueryParams {
  jql: string;
  maxResults: number;
}

export interface IJiraRequestQueryParams {
  expand?: string[];
}

export interface IJiraIssuesRequestQueryParams {
  fields?: string[];
  expand?: string[];
  nextPageToken?: string;
}

export type IJiraQueryParams =
  | IJiraRequestQueryParams
  | IJiraIteratorQueryParams
  | IJiraIssuesRequestQueryParams
  | IJiraIssuesIteratorQueryParams;

export interface IJiraProject {
  id: string;
  name: string;
}

export interface IJiraIssue {
  id: string;
  fields: IJiraIssueFields;
  renderedFields: IJiraIssueRenderedFields;
}

export interface IJiraUser {
  accountId: string;
  accountType: string;
  emailAddress: string;
  displayName: string;
}

export interface IJiraIssueFields {
  issuetype: IJiraIssueFieldsIssuetype;
  assignee: IJiraIssueFieldsAssignee;
  status: IJiraIssueFieldsStatus;
  project: IJiraIssueFieldsProject;
  created: string;
  updated: string;
}

export interface IJiraIssueRenderedFields {
  description: string;
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

export interface IJiraResponse<T> {
  nextPageToken?: string;
  issues?: T[];
  values?: T[];
}
export interface IJiraIssuesResponse<T> {
  nextPageToken?: string;
  issues?: T[];
}

export type IJiraTransformConfig = IMerjoonTransformConfigBase;
