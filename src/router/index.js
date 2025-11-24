import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/components/layout/component/index.vue'
import children from "./children";
import {dynamic} from './dynamic'
const {menuItems} = dynamic()
Vue.use(Router)
const routes = [
  ...children
];
const router = new Router({
  routes
})
// 重复点击相同路由报错处理
const VueRouterPush = Router.prototype.push;
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(error => error);
}
export default router;
/* 准备动态添加的路由 */
export const DynamicRoutes = [
  {
    path: '',
    component: layout,
    name: 'container',
    meta: {
      requiresAuth: true,
      name: '首页'
    },
    children: menuItems,
  },
  {
    path: '/403',
    component: () => import("@/view/other/403.vue")
  },
  {
    path: '/:catchAll(.*)', // 使用正则表达式来匹配所有剩余的路由
    name: 'NotFound',
    component:  () => import("@/view/other/404.vue"),
  },
];
router.addRoutes(DynamicRoutes)
