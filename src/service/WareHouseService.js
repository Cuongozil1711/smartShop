import axiosConfig from "./config/axiosConfig";
export const WareHouseService = {

    search: (payload) => {
        return axiosConfig.post('/wareHouse/search?page' + payload.page  + '&size=' + payload.size , {})
    },

    create: (payload) => {
        return axiosConfig.post("/wareHouse",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/wareHouse/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.put(`/wareHouse/delete/${id}`);
    }

}
