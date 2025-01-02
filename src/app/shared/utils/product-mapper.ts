import { Category } from '../interfaces/category.interface';
import { Product } from '../interfaces/product.interface';
import { DEFAULT_CATEGORY } from './constants';

export const mapProduct = (product: any, categories: Category[]): Product => ({
  productID: product.productID ?? 0,
  productName: product.productName ?? 'Unknown Product',
  productDescription: product.productDescription ?? '',
  productStock: product.productStock ?? 0,
  productCost: product.productCost ?? 0,
  productPrice: product.productPrice ?? 0,
  categoryID: product.categoryID,
  productCategory: categories.find(
    category => category.categoryID === product.categoryID) || DEFAULT_CATEGORY,
  discount: product.discount ?? 0,
});
