export interface UserToken {
    sub: string;
    email: string;
    nickname?: string;
    name: string;
    picture?: string;
    updated_at?: string;
    email_verified?: boolean;
    given_name?: string;
    family_name?: string;
    'http://localhost:3000/roles'?: string[];
}
