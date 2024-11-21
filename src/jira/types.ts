export interface IJiraConfig {
  token: string,
  subdomain: string,
  email: string,
  limit: number
}

export enum JiraApiPath {
  UsersSearch = 'users/search',
  ProjectSearch = 'project/search',
  Search = 'search',
}

export type IJiraGetAllRecordsEntity<T extends JiraApiPath> =
    T extends JiraApiPath.ProjectSearch ? IJiraProject:
        T extends JiraApiPath.UsersSearch ? IJiraUser :
            T extends JiraApiPath.Search ? IJiraIssue :
                never

export interface IJiraQueryParams {
  startAt: number;
  maxResults: number;
  expand: string;
}

export interface IJiraProject {
  id: string,
  name: string,
}

export interface IJiraIssue {
  id: string,
  fields: IJiraIssueFields,
  renderedFields: IJiraIssueRenderedFields,
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
  project: IJiraIssueFieldsProject,
  created: string,
  updated: string,
}

export interface IJiraIssueRenderedFields {
  description: string,
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

export interface IJiraIssueFieldsProject {
  id: string
}
