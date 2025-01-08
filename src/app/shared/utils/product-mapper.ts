import { ProductApiRequest } from "../interfaces/product-api-request.interface";
import { ProductApiResponse } from "../interfaces/product-api-response.interface";
import { Product } from "../interfaces/product.interface";

export const mapProductListResponse = (products: ProductApiResponse[]): Product[] => {
  return products.map((item): Product => ({
    productID: item.productID,
    productName: item.productName,
    productDescription: item.productDescription,
    productStock: item.productStock,
    productCost: item.productCost,
    productPrice: item.productPrice,
    productCategory: {
      categoryID: item.categoryID,
      categoryName: item.productCategoryName,
    },
    discount: item.discount
  }));
};

export const mapProductToApiRequest = (product: Product): ProductApiRequest => {
  return {
    productID: product.productID ?? 0,
    productName: product.productName,
    productDescription: product.productDescription,
    productCost: product.productCost,
    productPrice: product.productPrice,
    categoryID: product.productCategory.categoryID ?? 0,
    discount: product.discount
  };
};