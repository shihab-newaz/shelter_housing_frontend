// services/auth.service.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class AuthService {
  private tokenKey = 'access_token';

  async login(email: string, password: string) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    if (response.data.access_token) {
      localStorage.setItem(this.tokenKey, response.data.access_token);
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isAuthenticated() {
    const token = this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();