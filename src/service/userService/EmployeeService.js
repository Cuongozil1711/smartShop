import axiosConfig from "../config/axiosConfig";

export const EmployeeService = {

    create: (payload) => {
        return axiosConfig.post("/user/create",payload);
    },

    search: (payload) => {
        return axiosConfig.post("/user/employee/search",payload);
    },

    delete: (payload) => {
        return axiosConfig.get("/user/delete/" + payload);
    }
}
