import AppConfig from "../config/AppConfig";

class UserService {
  async findUsersExceptsSelf(token) {
    try {
      const response = await fetch(`${AppConfig.backendUrl}/api/v1/users`, {
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
        error: error.message || "Failed to fetch the users!",
      };
    }
  }

  async findSearchedUsers(query, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/users/search?query=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
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
        error: error.message || "Failed to fetch the users!",
      };
    }
  }

  async findUserById(id, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/users/u/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
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
        error: error.message || "Failed to fetch the users!",
      };
    }
  }

  async updateUser(request, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/users/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(request),
        }
      );
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
        error: error.message || "Failed to fetch the users!",
      };
    }
  }

  async uploadAvtar(file, token) {
    try {
      const request = new FormData();
      request.append("avtar", file);

      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/users/avtar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: request,
        }
      );
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
        error: error.message || "Failed to fetch the users!",
      };
    }
  }

  async removeAvtar(token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/users/avtar/remove`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
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
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to remove the avtar!",
      };
    }
  }

  async generateAuthenticatorSecrete(token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/users/get/authenticator/secrete`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            Accept: "application/json",
          },
        }
      );
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
        response: await response.json()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to remove the avtar!",
      };
    }
  }

  async enable2FA(request, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/users/enable/two-factor-authentication/authenticator/app`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(request)
        }
      );
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
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to remove the avtar!",
      };
    }
  }
}

export default new UserService();
