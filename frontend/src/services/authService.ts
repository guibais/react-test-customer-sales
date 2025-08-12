import { apiClient, type AuthResponse } from "./api";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.login(email, password);
    apiClient.setToken(response.access_token);
    return response;
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await apiClient.register(name, email, password);
    apiClient.setToken(response.access_token);
    return response;
  },

  logout() {
    apiClient.clearToken();
  },

  setToken(token: string) {
    apiClient.setToken(token);
  },
};
