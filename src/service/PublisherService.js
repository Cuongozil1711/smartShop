import axiosConfig from "./config/axiosConfig";
export const PublisherService = {

    search: (payload) => {
        return axiosConfig.post('/publisher/search?page' + payload.page  + '&size=' + payload.size , {})
    },

    create: (payload) => {
        return axiosConfig.post("/publisher",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/publisher/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.put(`/publisher/delete/${id}`);
    }

}
