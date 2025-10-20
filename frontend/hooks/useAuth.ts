import { authService } from "@/services/authService";
import { LoginData, SignupData } from "@/types/authType";

export const useAuth = () => {
  const login = async (loginData: LoginData) => {
    try {
      await authService.login(loginData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      await authService.signup(signupData);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  return { login, signup };
};
