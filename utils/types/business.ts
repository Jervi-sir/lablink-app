import { User } from "./auth";
import { Wilaya } from "./taxonomy";

export interface BusinessCategory {
  id: number;
  code: string;
}
export interface LaboratoryCategory {
  id: number;
  code: string;
}

export interface Business {
  id: number;
  userId: number;
  user?: User;
  name: string;
  nif?: string | null;
  logo?: string | null;
  bio?: string | null;
  certificateUrl?: string | null;
  phoneNumbers?: string[] | null;
  address?: string | null;
  businessCategoryId: number;
  laboratoryCategoryId?: number | null;
  wilayaId: number;
  wilaya?: Wilaya;
  businessCategory?: BusinessCategory;
  laboratoryCategory?: LaboratoryCategory;
  createdAt: string;
}
