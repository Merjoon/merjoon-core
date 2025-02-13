export interface IShortcutConfig {
    token: string;
}
export interface IShortcutStory {
    id: number;
    name: string;
    owner_ids: string[] | [];
    description:string;
    created_at: string;
    updated_at: string;
    app_url:string;
}
export interface IShortcutMember {
    id: string;
}
export interface IShortcutStoryResponse {
    next:string;
    data: IShortcutStory[];
}
export interface IShortcutMemberResponse {
    members:IShortcutMember[];
}
export enum ShortcutApiPath {
    Member = 'members',
    SearchStory = 'search/stories',
}
export interface IShortcutQueryParams{
    query:string,
    next?:string | null,
}
