import { LoginData, SignupData } from "@/types/authType";

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
        const errorData = await response.json();
        throw new Error(errorData.detail);
      }
      localStorage.setItem("token", (await response.json()).token);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${this.VITE_API_URL}/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // This will be caught by the .catch block
        throw new Error("Token verification failed");
      }

      return await response.json();
    } catch (error) {
      throw new Error("An error occurred during token verification.");
    }
  };
}

export const authService = new AuthService();
