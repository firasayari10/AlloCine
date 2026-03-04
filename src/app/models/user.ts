export interface User {
  id?: number;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  points?: number;
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
