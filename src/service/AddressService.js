import axiosConfig from "./config/axiosConfig";

export const AddressService = {

    getAddress() {
        return axiosConfig.get('/address');
    }

}
