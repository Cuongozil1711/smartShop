import axiosConfig from "./config/axiosConfig";
export const ReceiptImportWareHouseService = {

    search: (payload) => {
        return axiosConfig.post('/receipt-import/search?page' + payload.page  + '&size=' + payload.size, {})
    },

    create: (payload) => {
        return axiosConfig.post("/receipt-import",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/receipt-import/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.put(`/receipt-import/delete/${id}`);
    }

}
