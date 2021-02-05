import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import axios from "axios";
import router from './router';
import qs from "qs";
import VueResource from 'vue-resource';
import 'ant-design-vue/dist/antd.css'

Vue.use(Antd);
Vue.use(VueResource);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

router.beforeEach((to, from, next) => {
  //var _this = this;
  console.log(to);
  console.log(from);
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if(localStorage.getItem('access_token')){ //判断本地是否存在access_token
      next();
    }else {
      if(to.path === '/login'){
        next();
      }else {
        next({
          path:'/login'
        })
        //_this.$message.error('需要进行登录或者注册才能继续访问');
      }
    }
  }
  else {
    next();
  }
  /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
  if(to.fullPath == "/login"){
    if(localStorage.getItem('access_token')){
      next({
        path:from.fullPath
      });
    }else {
      next();
    }
  }
});
