import axiosConfig from "./config/axiosConfig";

export const ReceiptExportWareHouseService = {

    search: (payload) => {
        return axiosConfig.post('/receipt-export/search?page' + payload.page  + '&size=' + payload.size, {})
    },

    create: (payload) => {
        return axiosConfig.post("/receipt-export",payload);
    },

    edit: (id, payload) => {
        return axiosConfig.put(`/receipt-export/${id}`, payload);
    },

    delete: (id) => {
        return axiosConfig.put(`/receipt-export/delete/${id}`);
    }

}
