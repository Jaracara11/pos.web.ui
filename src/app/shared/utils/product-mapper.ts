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
    categoryID: item.categoryID,
    productCategory: {
      categoryID: item.categoryID,
      categoryName: item.productCategoryName,
    },
    discount: item.discount
  }));
};
