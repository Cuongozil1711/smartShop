import axiosConfig from "./config/axiosConfig";

export const PositionService = {

    getPosition() {
        return axiosConfig.get('/position/search');
    }

}
