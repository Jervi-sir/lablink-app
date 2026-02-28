/* --------- Auth --------- */

import { Department, Role } from "./taxonomy";

export interface User {
  id: number;
  email: string;
  phoneNumber?: string | null;
  avatar?: string | null;
  role?: Role;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  studentProfile?: StudentAuth;
  businessProfile?: BusinessAuth;
}

export interface StudentAuth {
  id: number;
  userId: number;
  fullName: string;
  studentCardId: string;
  department?: Department;
}

export interface BusinessAuth {
  id: number;
  userId: number;
  user?: User;
  fullName: string;
  logo?: string;
  studentCardId: string;
  departmentId: number;
  department?: Department;
}
