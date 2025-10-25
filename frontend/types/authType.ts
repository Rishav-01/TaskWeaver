import { z } from "zod";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
}

export interface LoginDataResponse {
  token: string;
  token_type: string;
}

export interface SignupDataResponse {
  token: string;
  token_type: string;
}

export const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});
