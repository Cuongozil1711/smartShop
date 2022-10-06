import axiosConfig from "./config/axiosConfig";
export const OrderService = {

    search: (payload, status) => {
        return axiosConfig.post(`/order/search/${status}?page` + payload.page  + '&size=' + payload.size + "&search=" +payload.search, {})
    },

    getById: (payload) => {
        return axiosConfig.get('/order/' + payload)
    },

    createOrder: (payload) => {
        return axiosConfig.post('/order',payload)
    },

    delete: (id) => {
        return axiosConfig.delete(`/order/${id}`)
    },

    restore: (ids) => {
        return axiosConfig.get(`/order/restore/`+  ids);
    }

}
