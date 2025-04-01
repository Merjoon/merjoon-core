export interface IJiraConfig {
  token: string;
  subdomain: string;
  email: string;
  limit: number;
}

export enum JiraApiPath {
  Users = 'users',
  Project = 'project',
  Search = 'search',
}

export interface IJiraQueryParams {
  startAt: number;
  maxResults: number;
}

export interface IJiraProject {
  id: string;
  name: string;
}

export interface IJiraIssue {
  id: string;
  fields: IJiraIssueFields;
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

export interface IJiraResponse<T> {
  issues?: T[];
  values?: T[];
}
