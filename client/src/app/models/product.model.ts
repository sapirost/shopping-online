export class Product {
    _id: string;
    name: string;
    category: string;
    categoryID?: string;
    price: number;
    image: string;
}

export class Category {
    _id: string;
    name: string;
}
