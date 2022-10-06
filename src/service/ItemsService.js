import axiosConfig from "./config/axiosConfig";
export const ItemsService = {

    search: (payload) => {
        return axiosConfig.post('/items/search?page' + payload.page  + '&size=' + payload.size + "&search=" +payload.search, {})
    },

    getList: () => {
        return axiosConfig.get('/items/list')
    },

    create: (payload) => {
        return axiosConfig.post("/items",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/items/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.put(`/items/delete/${id}`);
    },

    details: (id) => {
        return axiosConfig.get(`/items/details/${id}`);
    }

}
