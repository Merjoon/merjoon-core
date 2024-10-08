export interface IHeightConfig {
  apiKey: string;
}

export interface IHeightQueryParams {
  page?: number;
  limit?: number;
  usePagination?: boolean;
  order?: string;
  filters?: string;
}

export enum HeightApiPath {
  People = "users",
  Projects = "lists",
  Tasks = "tasks",
}

export interface IHeightUser {
  createdAt: string;
  id: string;
  model: string;
  hue: number;
  auth: string[];
  pictureUrl: string | null;
  key: string;
  access: string;
  admin: boolean;
  deleted: boolean;
  state: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  signedUpAt?: string;
  botType?: string;
}

export interface IHeightList {
  "@changed": Record<string, unknown>;
  id: string;
  model: string;
  name: string;
  teamId: string | null;
  archivedAt: string | null;
  archivedBy: string | null;
  description: string;
  filters: {
    listIds: {
      values: string[];
    };
  };
  fields: {
    id: string;
  }[];
  fieldsSummaries: Record<string, { type: string }>;
  sectionsSummaries: Record<string, unknown>;
  sortBy: {
    type: string;
    sort: string;
  };
  viewBy: string | null;
  subviewBy: string | null;
  viewByMobile: string | null;
  subviewByMobile: string | null;
  visualization: string;
  key: string;
  userId: string;
  type: string;
  reserved: boolean;
  showCompletedTasks: string;
  showCompletedTasksCustomFilter: string | null;
  subtaskHierarchy: string;
  appearance: {
    icon: string;
    hue: number;
    iconUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  defaultList: boolean;
  url: string;
  topActiveUsersIds: string[];
  totalActiveUsersCount: number;
  calendarVisualizationOptions: {
    showWeekends: boolean;
  };
  ganttVisualizationOptions: {
    zoomLevel: number;
    sidebarCollapsed: boolean;
    sidebarWidth: number;
    dateUnit: string;
  };
  customToolbar: unknown[];
  searchTopResultCount: number;
  searchHighlightMode: string;
  memberAccess: string;
  publicAccess: string | null;
  rootTaskId: string | null;
  notificationsSubscriptions: unknown[];
  subscribersIds: string[];
}

export interface IHeightTask {
  id: string;
  type: string;
  appearance: {
    icon: string;
  };
  model: string;
  createdAt: string;
  createdUserId: string;
  commentedByUserIds: string[];
  deleted: boolean;
  deletedAt: string | null;
  deletedByUserId: string | null;
  name: string;
  nameRichText: string;
  nameType: string;
  description: string;
  descriptionRichText: string;
  descriptionType: string;
  index: number;
  assigneesIds: string[];
  statusSetId: string | null;
  status: string;
  parentTaskId: string | null;
  teamIds: string[];
  listIds: string[];
  commentsAggregateCount: number;
  lastActivityAt: string;
  completed: boolean;
  completedAt: string | null;
  completedByUserId: string | null;
  startedAt: string | null;
  completedIn: number | null;
  inProgressFor: number | null;
  delayedFor: number | null;
  orderIndex: number;
  subtasksIds: string[];
  completedSubtasksIds: string[];
  fields: unknown[];
  gitBranches: unknown[];
  gitPullRequests: unknown[];
  parentTasks: unknown[];
  subscribersIds: string[];
  redacted: string | null;
  links: unknown[];
  url: string;
  trashedAt: string | null;
  trashedByUserId: string | null;
  lastDescriptionActivity: string | null;
}

export type IHeightGeneralType = IHeightUser | IHeightList | IHeightTask;
