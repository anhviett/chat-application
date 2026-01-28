import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosClient";
import { ConversationType } from "@/types/conversation-type";

export const conversationApi = {
  getConversations: async function (cancel = false) {
    const response = await api.request({
      url: "chats/conversations",
      method: "GET",
      signal: cancel
        ? cancelApiObject[
            this.getConversations.name
          ].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
  getConversation: async function (conversationId: string, cancel = false) {
    const response = await api.request({
      url: `chats/conversations/${conversationId}`,
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getConversation.name].handleRequestCancellation()
            .signal
        : undefined,
    });

    return response.data;
  },
  createConversation: async function (data: ConversationType, cancel = false) {
    const response = await api.request({
      url: "chats/conversations",
      method: "POST",
      data: data,
      signal: cancel
        ? cancelApiObject[
            this.createConversation.name
          ].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

const cancelApiObject = defineCancelApiObject(conversationApi);
