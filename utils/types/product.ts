import { User } from "./auth";
import { Business } from "./business";

export type OfferType = "sale" | "rent";
export interface ProductCategory {
  id: number;
  code: string;
}

export interface Product {
  id: number;
  businessId: number;
  business?: Business;
  productCategoryId: number;
  category?: ProductCategory;
  name: string;
  offerType: OfferType;
  unit: string;
  price: number;
  safetyLevel: number;
  msdsPath?: string | null;
  documentations?: string | null;
  stock: number;
  isAvailable: boolean;
  images?: ProductImage[];
  reviews?: ProductReview[];
  createdAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  path?: string | null;
  isMain?: boolean | null;
}

export interface ProductReview {
  id: number;
  userId: number;
  user?: User;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductFavorite {
  id: number;
  userId: number;
  productId: number;
  product?: Product;
}


