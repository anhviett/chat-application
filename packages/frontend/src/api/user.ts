import { api } from "./configs/axiosConfig";
import { defineCancelApiObject } from "./configs/axiosClient";

export const userApi = {
  get: async function (id: number, cancel = false) {
    const response = await api.request({
      url: `/users/${id}`,
      method: "GET",
      // retrieving the signal value by using the property name
      signal: cancel
        ? cancelApiObject[this.get.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
  getAll: async function (cancel = false) {
    const response = await api.request({
      url: "/users",
      method: "GET",
      signal: cancel
        ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal
        : undefined,
    });

    return response.data;
  },
};

const cancelApiObject = defineCancelApiObject(userApi);
