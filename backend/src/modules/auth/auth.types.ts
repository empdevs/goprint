import { UserRole } from "../../types/domain.js";

export type RegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  nim?: string;
  studyProgram?: string;
  password: string;
  role: Exclude<UserRole, "admin">;
  campusLocation: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
