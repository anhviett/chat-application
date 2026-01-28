import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosClient";
import { LoginInput } from "@/types/login-input";
import { RegisterInput } from "@/types/register-input";

export const authApi = {
  login: async function (data: LoginInput, cancel = false) {
    const response = await api.request({
      url: "/auth/login",
      method: "POST",
      data: data,
      signal: cancel
        ? cancelApiObject[this.login.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
  register: async function (data: RegisterInput, cancel = false) {
    const response = await api.request({
      url: "/auth/register",
      method: "POST",
      data: data,
      signal: cancel
        ? cancelApiObject[this.register.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
  getMe: async function (cancel = false) {
    const response = await api.request({
      url: "/users/me",
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getMe.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

const cancelApiObject = defineCancelApiObject(authApi);