import Vue from 'vue'
import Router from "vue-router"

//组件模块
import home from "@/components/homePage";
import DetailPage from "@/components/DetailPage";
import writeAnswer from "@/components/writeAnswer";
import answerByUser from "@/components/answerByUser";
import login from "@/user/login";
import register from "@/user/register";
import personSpace from "@/user/personSpace";
import alterAnswer from "@/components/alterAnswer";
import searchPage from "@/components/searchPage";
import messagePage from "@/components/messagePage";
import changeInfomation from "@/user/changeInfomation";
import personQuestion from "@/user/personQuestion";
import changeQuestion from "@/user/changeQuestion";
import changeAnswer from "@/user/changeAnswer";
import addAnswer from "@/components/addQuestion";
import getComments from "@/components/getComments";
import addQuestion from "@/components/addQuestion";

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    routes: [
        { path: '/', name: 'home', component: home},
        { path: '/detailpage', name: 'DatailPage',component: DetailPage},
        { path: '/write', name: 'writeAnswer',component: writeAnswer, meta:{requireAuth:true}},
        { path: '/answerByUser', name: 'answerByUser',component: answerByUser, meta:{requireAuth:true}},
        { path: '/login', name: 'login',component: login},
        { path: '/register', name: 'register',component: register},
        { path: '/personSpace', name: 'personSpace',component: personSpace, meta:{requireAuth:true}},
        { path: '/alterAnswer', name: 'alterAnswer',component: alterAnswer, meta:{requireAuth:true}},
        { path: '/searchPage', name: 'searchPage',component: searchPage},
        { path: '/messagePage', name: 'messagePage',component: messagePage, meta:{requireAuth:true}},
        { path: '/changeInfomation', name: 'changeInfomation',component: changeInfomation, meta:{requireAuth:true}},
        { path: '/personQuestion', name: 'personQuestion',component: personQuestion, meta:{requireAuth:true}},
        { path: '/changeQuestion', name: 'changeQuestion',component: changeQuestion, meta:{requireAuth:true}},
        { path: '/changeAnswer', name: 'changeAnswer',component: changeAnswer, meta:{requireAuth:true}},
        { path: '/addAnswer', name: 'addAnswer',component: addAnswer, meta:{requireAuth:true}},
        { path: '/getComments', name: 'getComments',component: getComments, meta:{requireAuth:true}},
        { path: '/addQuestion', name: 'addQuestion',component: addQuestion, meta:{requireAuth:true}},
    ]
})