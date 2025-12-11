export type Credentials = {
    email: string,
    password: string
}

export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    tenant: Tenant | null;
    createdAt: string;
}

export type CreateUserData = {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    tenantId: number
}

export type Tenant = {
    id: number,
    name: string,
    address: string,
}

export type CreateTenant = {
    name: string,
    address: string,
}

export type FieldData = {
    name: string[];
    value?: string
}