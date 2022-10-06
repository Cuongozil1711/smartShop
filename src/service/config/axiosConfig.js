import axios from 'axios';
import {token, uid} from "../../assets/untils/const";
// Next we make an 'instance' of it
const instance = axios.create({
// .. where we make our configurations
    baseURL: process.env.REACT_APP_BE_URL,
});

// Where you would set stuff like your 'Authorization' header, etc ...
instance.defaults.headers.common['Authorization'] = token ?? "";
instance.defaults.headers.common['cid'] = 69
instance.defaults.headers.common['uid'] = uid ?? "";

// Also add/ configure interceptors && all the other cool stuff

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

export default instance;
