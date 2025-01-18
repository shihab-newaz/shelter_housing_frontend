// types/auth.ts
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    access_token: string;
  }
  
  export interface AdminUser {
    id: number;
    email: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }