import { Category } from "./category.interface";

export interface Product {
  productID?: string;
  productName: string;
  productDescription: string;
  productStock: number;
  productCost: number;
  productPrice: number;
  productQuantity?: number;
  productCategory: Category;
}