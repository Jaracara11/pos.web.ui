export interface Product {
  productID?: string;
  productName: string;
  productDescription: string;
  productStock: number;
  productCost: number;
  productPrice: number;
  productCategoryID: number;
  productQuantity?: number;
}