import axiosConfig from "../config/axiosConfig";

export class LoginService {

    login(payload) {
        return axiosConfig.post('/user/login', payload);
    };

    checkToken() {
        return axiosConfig.get('/user/checkToken');
    }
}
