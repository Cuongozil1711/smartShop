import axiosConfig from "./config/axiosConfig";
export const ImportWareHouseService = {

    search: (payload, status, search, date) => {
        return axiosConfig.post(`/import-ware-house/list/${status}?page` + payload.page  + '&size=' + payload.size + '&search=' + search, date)
    },

    listImport: (payload, status, search, date) => {
        return axiosConfig.post(`/import-ware-house/list-import/${status}?page` + payload.page  + '&size=' + payload.size + '&search=' + search, date)
    },

    create: (payload) => {
        return axiosConfig.post("/import-ware-house/list",payload);
    },


    get: (id) => {
        return axiosConfig.get(`/import-ware-house/${id}`);
    },

    edit: (payload) => {
        return axiosConfig.post(`/import-ware-house/edit`, payload);
    },

    delete: (id) => {
        return axiosConfig.delete(`/import-ware-house/${id}`);
    },

    checkRemoveItem: (id) => {
        return axiosConfig.get(`/import-ware-house/checkRemoveItem/${id}`);
    },

    restore: (ids) => {
        return axiosConfig.post(`/import-ware-house/restore`, ids);
    }

}
