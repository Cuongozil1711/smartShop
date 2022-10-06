import axiosConfig from "./config/axiosConfig";
export const CustomerService = {

    search: (payload) => {
        return axiosConfig.post('/customer/search?page' + payload.page  + '&size=' + payload.size , {})
    },

    create: (payload) => {
        return axiosConfig.post("/customer",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/customer/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.put(`/customer/delete/${id}`);
    }

}
