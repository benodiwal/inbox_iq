export type User = {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
};

export type Account = {
    id: string;
    platform: Platform,
    email: string
};

export enum Platform {
    GMAIL = 'GMAIL',
    OUTLOOK = 'OUTLOOK'
}
