import { api } from "./configs/axiosConfig"
import { defineCancelApiObject } from "./configs/axiosClient"
import { SendMessage } from "@/types/message-type.ts"

export const chatApi = {
    get: async function (id: number, cancel = false) {
        const response = await api.request({
            url: `/users/${id}`,
            method: "GET",
            // retrieving the signal value by using the property name
            signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    getAll: async function (cancel = false) {
        const response = await api.request({
            url: "/users",
            method: "GET",
            signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    sendMessage: async function (data: SendMessage, cancel = false) {
        const response = await api.request({
            url: "/messages",
            method: "POST",
            data: data,
            signal: cancel ? cancelApiObject[this.sendMessage.name].handleRequestCancellation().signal : undefined,
        })
        return response.data;
    },
    getConversations: async function (cancel = false) {
        const response = await api.request({
            url: 'chats/conversations',
            method: "GET",
            signal: cancel ? cancelApiObject[this.getConversations.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    getConversationMessages: async function (conversationId: string, cancel = false) {
        const response = await api.request({
            url: `chats/conversations/${conversationId}/messages`,
            method: "GET",
            signal: cancel ? cancelApiObject[this.getConversationMessages.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    createConversation: async function (data: any, cancel = false) {
        const response = await api.request({
            url: 'chats/conversations',
            method: "POST",
            data: data,
            signal: cancel ? cancelApiObject[this.createConversation.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
}

const cancelApiObject = defineCancelApiObject(chatApi)