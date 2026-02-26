export type RoleCode = "student" | "lab" | "wholesale" | "admin";

export interface Wilaya {
  id: number;
  name: string;
}

export interface University {
  id: number;
  name: string;
  wilaya?: Wilaya;
}

export interface Department {
  id: number;
  name: string;
  university?: University;
}

// Users & Profiles
export interface Role {
  id: number;
  code: RoleCode;
}
