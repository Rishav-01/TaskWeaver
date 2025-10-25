import { LoginData, LoginDataResponse, SignupData } from "@/types/authType";

class AuthService {
  private VITE_API_URL: string = "http://localhost:8000";

  async login(loginData: LoginData) {
    try {
      const response = await fetch(`${this.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      localStorage.setItem("token", (await response.json()).token);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async signup(signupData: SignupData) {
    try {
      const response = await fetch(`${this.VITE_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      localStorage.setItem("token", (await response.json()).token);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
