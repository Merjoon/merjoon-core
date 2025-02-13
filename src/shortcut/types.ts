export interface IShortcutConfig {
    token: string;
}
export interface IShortcutStory {
    id: number;
    name: string;
    owner_ids: string[];
    description:string;
    created_at: string;
    updated_at: string;
    app_url:string;
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
    Member = 'members',
    Search = 'search',
    Stories = 'stories',
}
