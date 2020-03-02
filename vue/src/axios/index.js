import axios from "axios";
import Vue from "vue";

const http = axios.create({
  baseURL: "http://192.168.199.106:3000/api",
  withCredentials: true, //允许接收cookie
});
Vue.prototype.$axios = http;
