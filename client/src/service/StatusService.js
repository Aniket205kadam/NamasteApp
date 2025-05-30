import AppConfig from "../config/AppConfig";

class StatusService {
  async uploadImageOrVideo(file, caption, token) {
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("file", file);

      const response = await fetch(`${AppConfig.backendUrl}/api/v1/status/upload-media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });
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
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async connectedUserHasStatus(token) {
    try {
      const response = await fetch(`${AppConfig.backendUrl}/api/v1/status/m/p`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
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
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async fetchFriendsStatus(token) {
    try {
      const response = await fetch(`${AppConfig.backendUrl}/api/v1/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
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
        error: error.message || "Failed to fetch friends status!",
      };
    }
  }

  async getStatusByUser(userId, token) {
    try {
      const response = await fetch(`${AppConfig.backendUrl}/api/v1/status/s/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
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
        error: error.message || "Failed to fetch friends status!",
      };
    }
  }

  async viewStatus(statusId, token) {
    try {
      const response = await fetch(`${AppConfig.backendUrl}/api/v1/status/v/${statusId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
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
        error: error.message || "Failed to fetch friends status!",
      };
    }
  }
}

export default new StatusService();