import axiosConfig from "./config/axiosConfig";

export const StatisticalService = {

    getStatistical() {
        return axiosConfig.get('/statisticalApi');
    },

    chartInfo() {
        return axiosConfig.get('/statisticalApi/chartInfo');
    },

    getOrderByEmployee() {
        return axiosConfig.get('/statisticalApi/getOrderByEmployee');
    }

}
