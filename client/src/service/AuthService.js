import AppConfig from "../config/AppConfig";

class AuthService {
  async signup(request) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(request),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error,
        };
      }
      return {
        success: true,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to signup the new user!",
      };
    }
  }

  async emailVerification(email, otp) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/auth/verification/${email}/${otp}`
      );
      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          error: error,
        };
      }
      return {
        success: true,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed verify the email!",
      };
    }
  }
}

export default new AuthService();
