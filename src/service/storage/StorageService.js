import axiosConfig from "../config/axiosConfig";

export const StorageService = {

    upload: (type, rootId, payload) => {
        return axiosConfig.post('/upload/image?type=' + type + '&&rootId=' + rootId, payload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    },

}
