export interface IShortcutConfig {
    token: string;
    limit: number;
}
export interface IShortcutStory {
    id: number;
    name: string;
    owner_ids: string[];
    description:string;
    created_at: string;
    updated_at: string;
    app_url:string;
    workflow_id: number;
    workflow_state_id: number;
    workflow_state_name?:string;
}
export interface IShortcutMember {
    id: string;
    profile: IShortcutMemberProfile;
    created_at: string;
    updated_at: string;
}
export interface IShortcutMemberProfile{
    name: string;
    email_address: string;
}
export enum ShortcutApiPath {
    Members = 'members',
    Search = 'search',
    Stories = 'stories',
    Workflows ='workflows',
}
export interface IShortcutWorkflow{
    id: number;
    states: IShortcutWorkflowState[];
}
export interface IShortcutWorkflowState{
    id: number;
    name: string;
}
export interface IGetStoriesResponse{
    next: string | null;
    data: IShortcutStory[];
}