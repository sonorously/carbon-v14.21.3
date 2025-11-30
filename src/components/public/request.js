/*
* 对接口请求进行封装
* */
// import router from '@/router/index.js';
import axios from "axios";
// function delHeadSlash(str){
//     return str.replace(/^\/*/g ,'')
// }
const downloadList = [
    '/carbon-check/standardFile/getStandardFile',
];
//创建axios实例k
const service = axios.create({
    baseURL: "/api",
    timeout: 120 * 1000, //超时时间
    // downloadList: downloadList, // 下载接口特殊处理
});
//http请求拦截器
//---就是你请求接口的时候，我会先拦截下来，对你的数据做一个判断，或者携带个token给你---
service.interceptors.request.use((config) => {
    console.log("数据传值：", config)
    //请求的数据
    // 下载接口超时时间设置为5分钟
    // if (service.defaults.noEncryptionResponse.every(item => { return response.config.url.indexOf(delHeadSlash(item)) == -1 })) {}
    if (config.url.indexOf('/download') > -1 || config.url.indexOf('carbon-check/standardFile/getStandardFile') > -1 || config.url.indexOf('carbon-check/carbonReport/getCarbonReportFile') > -1 || config.url.indexOf('carbon-check/carbonModelInfo/getCarbonModelFile') > -1 || config.url.indexOf('carbon-check/productCategoryInfo/getCarbonModelFileByCategory') > -1) {
        config.timeout = 15 * 60 * 1000;
    }
    if (config.url.indexOf('/download') > -1 || config.url.indexOf('carbon-check/standardFile/saveStandardFileAdd') > -1 ) {
        config.headers["Content-Type"] = "multipart/form-data";
    } else {
        config.headers["Content-Type"] = "application/json"; //application/x-www-form-urlencoded
    }
    return config//必须返回出去，不然请求发不出去

}, error => {
    //处理错误请求
    return Promise.reject(error)
});

//响应拦截：后端返回来的结果
service.interceptors.response.use((response) => {
    console.log("下载：", response)
    if (response.config.url.indexOf('carbon-check/standardFile/getStandardFile') > -1 || response.config.url.indexOf('carbon-check/carbonReport/getCarbonReportFile') > -1 || response.config.url.indexOf('carbon-check/carbonModelInfo/getCarbonModelFile') > -1 || response.config.url.indexOf('carbon-check/productCategoryInfo/getCarbonModelFileByCategory') > -1) {
        return Promise.resolve(response)
    } else {
        const code = response.data.status//code是后端的状态码,判断后端返回的状态码的接收值是否正确
        if (code !== 200) {
            //请求失败（包括token失效，302，404...根据和后端约定好的状态码做出不同的处理）
            return Promise.reject(response);
        } else {
            console.log('普通接口：', response);
            //请求成功
            return Promise.resolve(response.data)
        }
    }
}, (err) => {
    console.log('错误信息的处理',err.response.status )//错误信息的处理
    if (err.response.status === 401) {
        // sessionStorage.removeItem('userName');
        // sessionStorage.removeItem('password');
        // router.push('/login');
    }
    //处理错误响应
    return Promise.reject(err)
})
//因为别的地方要用，所以就把实例暴露出去，导出
export default service