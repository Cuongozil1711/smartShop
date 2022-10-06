import axiosConfig from "./config/axiosConfig";
export const CategoryService = {

    search: (payload) => {
        return axiosConfig.post('/category/search?page' + payload.page  + '&size=' + payload.size , {})
    },

    create: (payload) => {
        return axiosConfig.post("/category",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/category/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.put(`/category/delete/${id}`);
    }

}
