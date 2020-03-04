import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";
import Cart from "../views/Cart.vue";
import Address from "../views/Address.vue";
import Order from "../views/Order.vue";

Vue.use(VueRouter);

const routes = [
  {
    path:"/",
    name:"homeLink",
    component:Home
  },
  {
    path: "/login",
    name: "loginLink",
    component: Login
  },
  {
    path: "/cart",
    name: "cartLink",
    component: Cart
  },
  {
    path: "/address",
    name: "addressLink",
    component: Address
  },
  {
    path: "/order",
    name: "orderLink",
    component: Order
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
