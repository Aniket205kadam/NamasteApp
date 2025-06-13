import AppConfig from "../config/AppConfig";

class ChatService {
  async getMyChats(token) {
    try {
      const response = await fetch(`${AppConfig.backendUrl}/api/v1/chats`, {
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
          status: response.status,
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
        error: error.message || "Failed to fetch chats!",
      };
    }
  }

  async createChats(senderId, recipientId, token) {
    try {
      const endpoint = new URL(`${AppConfig.backendUrl}/api/v1/chats`);
      endpoint.searchParams.append("sender-id", senderId);
      endpoint.searchParams.append("receiver-id", recipientId);

      const response = await fetch(endpoint.toString(), {
        method: "POST",
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
        const error = await response.text();
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
        error: error.message || "Failed to create new chat",
      };
    }
  }

  async findChatById(chatId, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/chats/c/${chatId}`,
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
        error: error.message || "Failed to fetch chats!",
      };
    }
  }

  async findMessages(chatId, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/messages/chat/${chatId}`,
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
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async sendMessage(request, token) {
    try {
      const response = await fetch(`${AppConfig.backendUrl}/api/v1/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(request),
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
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async seenMessages(chatId, token) {
    try {
      const endpoint = new URL(`${AppConfig.backendUrl}/api/v1/messages`);
      endpoint.searchParams.append("chat-id", chatId);

      const response = await fetch(endpoint.toString(), {
        method: "PATCH",
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
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async uploadFile(file, caption, chatId, token) {
    try {
      const request = new FormData();
      request.append("chat-id", chatId);
      request.append("caption", caption);
      request.append("file", file);

      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/messages/upload-media`,
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
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async findMessageById(messageId, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/messages/m/${messageId}`,
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
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async deleteMessage(chatId, messageId, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/messages/c/${chatId}/d/${messageId}`,
        {
          method: "DELETE",
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
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async getAllNotifications(token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/messages/u/get/unread/msg`,
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
        response: await response.text(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async getChatIdBySenderIdAndReciverId(user1Id, user2Id, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/chats/u1/${user1Id}/u2/${user2Id}`,
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
        response: await response.text(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async sendMessageTypingNotification(request, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/messages/typing`,
        {
          method: "POST",
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
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async enhanceMessage(message, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/ai/enhance/message?message=${message}`,
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
        response: await response.text(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }

  async getChatMedia(chatId, token) {
    try {
      const response = await fetch(
        `${AppConfig.backendUrl}/api/v1/chats/c/m/${chatId}`,
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
        error: error.message || "Failed to fetch chat messages!",
      };
    }
  }
}

export default new ChatService();
