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
  SearchIssues = 'search/jql',
}

export interface IJiraIteratorQueryParams {
  jql?: string;
  startAt?: number;
  maxResults: number;
}

export interface IJiraRequestQueryParams {
  startAt?: number;
  expand?: string[];
  fields?: string[];
  renderedFields?: string[];
  nextPageToken?: string;
}

export type IJiraQueryParams = IJiraIteratorQueryParams | IJiraRequestQueryParams;

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
  issues?: T[];
  values?: T[];
  nextPageToken?: string;
}

export type IJiraTransformConfig = IMerjoonTransformConfigBase;
