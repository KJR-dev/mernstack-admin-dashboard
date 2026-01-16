export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  tenant: Tenant | null;
  createdAt: string;
};

export type CreateUserData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  tenantId: number;
};

export type Tenant = {
  id: string;
  name: string;
  address: string;
};

export type CreateTenant = {
  name: string;
  address: string;
};

export type FieldData = {
  name: string[];
  value?: string;
};

export interface PriceConfiguration {
  [key: string]: {
    priceType: 'base' | 'additional';
    availableOptions: string[];
  };
}

export interface Attribute {
  name: string;
  widgetType: 'switch' | 'radio';
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
};

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
};

export type ImageField = { file: File };
export type CreateProductData = Product & { image: ImageField };

export enum OrderStatus {
  RECEIVED = 'received',
  CONFIRMED = 'confirmed',
  PREPARED = 'prepared',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum PaymentMode {
  CARD = 'card',
  CASH = 'cash',
}

export type Topping = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export interface CartItem
  extends Pick<Product, '_id' | 'name' | 'image' | 'priceConfiguration'> {
  chosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
}

export interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Order {
  _id: string;
  image: string;
  cart: CartItem[];
  customerId: Customer;
  total: number;
  discount: number;
  taxes: number;
  deliveryCharges: number;
  address: string;
  tenantId: string;
  comment?: string;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string;
}
