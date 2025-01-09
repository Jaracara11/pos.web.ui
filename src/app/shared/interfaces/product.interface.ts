import { Category } from "./category.interface";

export interface Product {
  productID?: number;
  productName: string;
  productDescription: string;
  productStock: number;
  productCost: number;
  productPrice: number;
  productCategory: Category;
  discount: number;
}
