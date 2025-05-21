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
        response: await response.text(),
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
        `${AppConfig.backendUrl}/api/v1/auth/verification/${email}/${otp}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
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
        error: error.message || "Failed verify the email!",
      };
    }
  }

  async resendOtp(email) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/auth/resend/${email}/otp`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
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
        error: error.message || "Failed verify the email!",
      };
    }
  }

  async login(request) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/auth/login`,
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
        response: await response.json(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to signup the new user!",
      };
    }
  }
}

export default new AuthService();
