<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header style="background-color: aliceblue">
      <div style="font-size: 25px;display: inline">
        <router-link :to="{name:'home',params:{'id':this.id,'img':this.img,'token':this.token}}">首页</router-link>
      </div>
      <a-input-search placeholder="请输入要搜索的问题" v-model="searchItem" style="width: 300px;margin-left: 550px;" @search="onSearch" />
      <a-badge :count=count title="通知" style="margin-left: 70px">
        <a-icon type="bell" style="font-size: 25px" title="通知" @click="getMessage"/>
      </a-badge>
      <router-link :to="{name:'personSpace',params:{'id':this.id,'img':this.img,'token':this.token}}">
        <a-avatar shape="square" size="large" :src=img style="margin-left: 50px;margin-bottom: 12px"/>
      </router-link>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 20px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '430px' }">
        <a-page-header
            style=""
            sub-title="返回个人主页"
            @back="exit"
        />
        <br/>
        <p style="font-size: 20px;display: inline;font-weight: bold" >头像：</p>
        <img :src=img style="margin-left: 50px" width="60" height="60">
        <br/><br/>
        <a-input placeholder="请输入新头像的链接" v-model=userImg></a-input><br/><br/>
        <a-button style="margin-left: 100px" @click="changeImg" type="primary">保存头像</a-button>
        <br/><a-divider/>
        <br/>
        <p style="font-size: 20px;display: inline;font-weight: bold">昵称：</p>
        <a-input style="width: 100px;margin-left: 50px" :placeholder=uName v-model=userName></a-input>
        <a-button style="margin-left: 100px" @click="changeName" type="primary">保存昵称</a-button>
        <br/><a-divider/>
        <br/>
        <p style="font-size: 20px;display: inline;font-weight: bold">密码：</p>
<!--        <a-input style="width: 150px;margin-left: 50px" placeholder="请输入邮箱验证码"></a-input>-->
<!--        <a-button style="margin-left: 100px">获取验证码</a-button><br/><br/>-->
        <a-input style="width: 200px;margin-left: 50px" type="email" v-model="uEmail" placeholder="请输入邮箱"></a-input>
        <br/><br/>
        <a-input style="width: 200px;margin-left: 110px" type="password" v-model="userPassword" placeholder="请输入新密码"></a-input>
        <a-button style="margin-left: 100px" @click="changePassword" type="primary">保存密码</a-button>

      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Q&A ©2020 Created by syzc
    </a-layout-footer>
  </a-layout>
</template>

<script>
export default {
  name: "changeInfomation",
  inject:['reload'],
  data(){
    return {
      //list:[],//接受用户的所有信息
      userImg:'',
      userName:'',//用户姓名
      userPassword:'',//用户密码
      uEmail:'',
      id:this.$route.params.id,//从登陆界面进行传值
      img:'',
      token:this.$route.params.token,
      searchItem:'',
      email:'',
      count:'',
      uName:'',
    }
  },
  mounted(){
    var _this = this;
    _this.$axios.post('/api/user/selectByUserId',
        _this.$qs.stringify({
          uId: _this.$route.params.id,//传用户账号
          // uId: 2,ok,测试成功
        }),{headers:{access_token:_this.token}}
    ).then(function (response) {
      console.log(response);
      //_this.userImg = response.data.data.uImg;
      //_this.userName = response.data.data.u_name;
      _this.uName = response.data.data.u_name;
      _this.email = response.data.data.u_email;
      _this.img = response.data.data.u_img;
    }).catch(function (error) {
      console.log(error);
      _this.$message.error('对不起，请求失败');
    });//end getUser函数，获取用户信息

    _this.$axios.post('/api/msg/showMsgNum',
        _this.$qs.stringify({
          userId: _this.$route.params.id,//router传值！！！
        }),{headers:{access_token:_this.token}}
    ).then(function (response) {
      console.log(response.data.data);
      _this.count = response.data.data;
      //_this.list = response.data.data;
    }).catch(function (error) {
      console.log(error);
      _this.$message.error('获取消息失败');
    })
  },
  methods:{
    onSearch(){
      var _this = this;
      _this.$axios.post('/api/quest/selectByTitle',
          _this.$qs.stringify({
            questionTitle:_this.searchItem,
          }),{ headers: { access_token: _this.token } }
      ).then(function (response) {
        console.log(response.data.data);
        _this.$router.push({
          path:'/searchPage',
          name:'searchPage',//路由命名
          params:{
            list:response.data.data,
            id:_this.id,
            img:_this.img,
            token:_this.token
          },
        });//end 页面跳转
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('请求失败');
      })
    },//end onSearch函数，进行查找问题

    changeName(){
      var _this = this;
      _this.$axios.post('/api/user/alterName',
        _this.$qs.stringify({
          uId:_this.id,
          uName:_this.userName,
        }),{headers:{access_token:_this.token}}
      ).then(function (response) {
        console.log(response.data);
        _this.$message.success('修改昵称成功');
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('修改昵称失败');
      })
      _this.reload();
    },//end changeName函数，修改昵称

    changeImg(){
      var _this = this;
      _this.$axios.post('/api/user/alterImg',
          _this.$qs.stringify({
            uId:_this.id,
            uImg:_this.userImg,
          }),{headers:{access_token:_this.token}}
      ).then(function (response) {
        console.log(response.data);
        _this.$message.success('修改头像成功');
        _this.img = _this.userImg;
        _this.reload();
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('修改头像失败');
      })
      _this.reload();
    },//end changeImg函数，修改头像

    changePassword(){
      var _this = this;
      _this.$axios.post('/api/user/alterPassword',
          _this.$qs.stringify({
            uEmail:_this.uEmail,
            uPwd:_this.userPassword,
          }),{headers:{access_token:_this.token}}
      ).then(function (response) {
        console.log(response.data);
        _this.$message.success('修改密码成功');
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('修改密码失败');
      })
      _this.reload();
    },//end changePassword函数，修改密码

    exit(){
      var _this = this;
      _this.$router.push({
        path:'/personSpace',
        name:'personSpace',
        params:{
          id:_this.id,
          img:_this.img,
          token:_this.token,
        }
      })
    },

    getMessage(){
      var _this = this;
      _this.$router.push({
        path:'/messagePage',
        name:'messagePage',
        params:{
          id:_this.id,
          img:_this.img,
          token:_this.token,
        }
      })
    },//end getMessage函数，获取消息
  },//end methods
}
</script>

<style scoped>

</style>