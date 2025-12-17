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
    id: string,
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

export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional";
        availableOptions: string[];
    };
}

export interface Attribute {
    name: string;
    widgetType: "switch" | "radio";
    defaultValue: string;
    availableOptions: string[];
}

export interface Category {
    _id: string;
    name: string;
    priceConfiguration: PriceConfiguration;
    attributes: Attribute[];
}
export type ProductAttribute = {
    name: string;
    value: string | boolean;
}

export type Product = {
    _id: string;
    name: string;
    description: string;
    image: string;
    category: Category;
    priceConfiguration: PriceConfiguration;
    attributes: ProductAttribute[];
    isPublish: boolean;
    createdAt: string;
}

export type ImageField = { file: File }
export type CreateProductData = Product & { image: ImageField };