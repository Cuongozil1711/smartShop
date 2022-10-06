import axiosConfig from "./config/axiosConfig";
export const PromotionsService = {

    createPromotions: (payload) => {
        return axiosConfig.post('/promotion',payload)
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/promotion/${id}`, payload);
    },

    search: (payload, status, search, date) => {
        return axiosConfig.post(`promotion/search?page` + payload.page  + '&size=' + payload.size)
    }
}
