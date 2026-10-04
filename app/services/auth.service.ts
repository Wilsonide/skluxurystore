import { Axios } from "@/lib/axios";

export interface User {
  id: string;
  email: string;
  user_name: string;
  name: string;
  role: string;
  is_verified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends User {
  access_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  user_name: string;
  name: string;
}

export interface ResetRequest {
  email: string;
}

export interface ResetConfirmRequest {
  token: string;
  new_password: string;
}

export const AuthService = {
  // ============================================================
  // REGISTER
  // ============================================================

  async register(data: RegisterRequest) {
    const response = await Axios.post("/auth/register", data);

    return response.data;
  },

  // ============================================================
  // LOGIN
  // ============================================================

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await Axios.post<LoginResponse>("/auth/login", data);

    return response.data;
  },

  // ============================================================
  // REFRESH ACCESS TOKEN
  // ============================================================

  async refresh(): Promise<{
    access_token: string;
  }> {
    const response = await Axios.post<{
      access_token: string;
    }>("/auth/refresh");

    return response.data;
  },

  // ============================================================
  // LOGOUT
  // ============================================================

  async logout(): Promise<void> {
    await Axios.post("/auth/logout");
  },

  // ============================================================
  // CURRENT USER
  // ============================================================

  async me(): Promise<User> {
    const response = await Axios.get<User>("/auth/me");

    return response.data;
  },

  // ============================================================
  // PASSWORD RESET
  // ============================================================

  async requestPasswordReset(data: ResetRequest) {
    const response = await Axios.post("/auth/reset", data);

    return response.data;
  },

  async confirmPasswordReset(data: ResetConfirmRequest) {
    const response = await Axios.post("/auth/reset/confirm", data);

    return response.data;
  },
};
