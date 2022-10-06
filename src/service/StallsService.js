import axiosConfig from "./config/axiosConfig";
export const StallsService = {

    search: (payload) => {
        return axiosConfig.post('/stalls/search?page' + payload.page  + '&size=' + payload.size , {})
    },

    create: (payload) => {
        return axiosConfig.post("/stalls",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/stalls/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.put(`/stalls/delete/${id}`);
    }

}
