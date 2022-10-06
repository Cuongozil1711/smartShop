import axiosConfig from "./config/axiosConfig";
export const ExportWareHouseService = {

    search: (payload, status, search) => {
        return axiosConfig.get(`/export-ware-house/list/${status}?page` + payload.page  + '&size=' + payload.size + '&search=' + search, {})
    },

    statistical: (payload, status, search, date) => {
        return axiosConfig.post(`/export-ware-house/statistical/export/${status}?page` + payload.page  + '&size=' + payload.size + '&search=' + search, date)
    },

    listExport: (payload, status, search, date) => {
        return axiosConfig.post(`/export-ware-house/list-export/${status}?page` + payload.page  + '&size=' + payload.size + '&search=' + search, date)
    },

    create: (payload) => {
        return axiosConfig.post("/items",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/items/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.delete(`/export-ware-house/${id}`);
    },

    get: (idReceiptExport) => {
        return axiosConfig.get('/export-ware-house/' + idReceiptExport)
    },

    export: (payload) => {
        return axiosConfig.post(`/export-ware-house/list/`,payload);
    },

    restore: (ids) => {
        return axiosConfig.post(`/export-ware-house/restore`, ids);
    },

    getListOrder: () => {
        return axiosConfig.get('/export-ware-house/getListOrder')
    }

}
