import { api } from "./configs/axiosConfig"
import { defineCancelApiObject } from "./configs/axiosClient"

export const authApi = {
    login: async function (data: any, cancel = false) {
        const response = await api.request({
            url: '/auth/login',
            method: "POST",
            data: data,
            signal: cancel ? cancelApiObject[this.login.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
    register: async function (cancel = false) {
        const response = await api.request({
            url: "/auth/register",
            method: "POST",
            signal: cancel ? cancelApiObject[this.register.name].handleRequestCancellation().signal : undefined,
        })

        return response.data
    },
}

const cancelApiObject = defineCancelApiObject(authApi)