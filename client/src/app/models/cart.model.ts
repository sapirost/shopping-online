import { Product } from './product.model';

export class Cart {
    status: 'open' | 'close';
    user: string;
    creationDate: string;
    items: Item[];
}

export class Item extends Product {
    productID: string;
    quantity: number;
}
