import AppConfig from "../config/AppConfig";

class AIService {

  async getAIBot(token) {
    try {
      const response = await fetch(`${AppConfig.backendUrl}/api/v1/ai/bot`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (response.status === 403 || response.status === 401) {
        return {
          success: false,
          status: 403,
        };
      }
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
        error: error.message || "Failed to fetch AI Bot!",
      };
    }
  }
}

export default new AIService();