import axios from "axios";
import store from "../store";
const blog = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    post: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  },
  withCredentials: true
});

//POST传参序列化(添加请求拦截器)
blog.interceptors.request.use(
  config => {
    //在发送请求之前做某件事
    if (config.method === "post" && config.url.indexOf("file") === -1) {
      config.data = JSON.stringify(config.data);
    } else if (config.method === "post" && config.url.indexOf("file") !== -1) {
      config.headers.post["Content-Type"] =
        'content-type": "multipart/form-data';
    }
    return config;
  },
  error => {
    console.log("错误的传参");
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
blog.interceptors.response.use(
  res => {
    //对响应数据做些事
    if (res.data.code === -99) {
      store.commit("clearAll");
    }
    return Promise.resolve(res);
  },
  error => {
    console.log("网络异常");
    return Promise.reject(error);
  }
);

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
  return new Promise((resolve, reject) => {
    blog
      .post(url, params)
      .then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}
////返回一个Promise(发送get请求)
export function fetchGet(url, param) {
  return new Promise((resolve, reject) => {
    blog
      .get(url, { params: param })
      .then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      )
      .catch(error => {
        reject(error);
      });
  });
}
export default {
  fetchPost,
  fetchGet
};
