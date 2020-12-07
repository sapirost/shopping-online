export class User {
    _id: string;
    numberID?: string;
    email: string;
    firstName: string;
    lastName: string;
    city?: string;
    street?: string;
    role: UserRole;
}

export enum UserRole {
    client = 'user',
    admin = 'admin'
}
