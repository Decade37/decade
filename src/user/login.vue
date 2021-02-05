<template>
<div id="box">
  <a-form-model ref="form" :model="form" :rules="rules">
    <a-form-model-item prop="email">
      <a-input v-model="form.uEmail" placeholder="请输入登录的邮箱" autocomplete="off">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item prop="password">
      <a-input v-model="form.uPwd" type="password" placeholder="请输入密码" autocomplete="off">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-checkbox
          v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          },
        ]"
      >
        记住我
      </a-checkbox>
      <a class="login-form-forgot" href="">
        忘记密码
      </a>
      <a-button type="primary" html-type="submit" class="login-form-button" @click="handleSubmit()">
        登录
      </a-button>
      或者
      <a>
        <router-link to="/register">现在注册!</router-link>
      </a>
    </a-form-model-item>
  </a-form-model>
</div>
</template>

<script>
import {setCookie,getCookie} from "../cookie.js";
export default {
  name:"Login",
  data() {
    return{
      // email: '',
      // password: '',
      form:{
        uEmail:'',
        uPwd:'',
      },
      rules: {
        uEmail: { required: true, message: '请输入邮箱', trigger: 'blur' },
        uPwd: { required: true, message: '请输入登录密码', trigger: 'blur' }
      },
      captcha:'',
      id:'',
      img:'',
      token:'',
    }
  },
  methods: {
    select(){
      var _this = this;
      _this.$axios.post('/api/user/selectByUserId',
          _this.$qs.stringify({
            uId:_this.id,
          }),
          {headers:{access_token:_this.token}}
      ).then(function (response) {
        console.log(response.data);
        console.log(response.data.data.u_img);
        _this.img = response.data.data.u_img;
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('请求失败');
      })
    },//end onSearch函数，进行问题的搜索


    handleSubmit() {
      //e.preventDefault();
      var _this = this;
          console.log(_this.form.uEmail);
          console.log(_this.form.uPwd);
          _this.$axios.post('/api/user/login',
              _this.$qs.stringify({
                uEmail:_this.form.uEmail,
                uPwd:_this.form.uPwd,
              }),
              { headers: { access_token: _this.token } }
          ).then(function (response) {
            console.log('请求成功');
            console.log(response);
            console.log(response.data.data.token);
            console.log(response.data.data.user_id);
            _this.id = response.data.data.user_id;
            _this.token = response.data.data.token;
            localStorage.setItem('access_token',_this.token);
            //_this.select();
            setCookie(response.data.token);
            console.log(_this.img);
            _this.$router.push({
              path:'/',
              name:'home',//路由命名
              params:{
                id: response.data.data.user_id,
                //img:_this.img,
                token:response.data.data.token,
              }
            })
            _this.$message.success('恭喜您，登录成功');
          }).catch(function (error) {
            console.log(error);
            _this.$message.error('对不起，登录失败');
          })
        //}
      //});
    },

    tokenConfirm(token){
      // var _this = this;
      var _token = getCookie(token);
      this.axios.get('http://localhost:8080/tokenConfirm',{
        params:{
          token:_token
        }
      }).then(function(response){
            var obj = response.data;
            console.log(obj);
      }).catch(function(error){
            console.log(error);
      });
    }
  },
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
.login-form-button {
  width: 100%;
}
#box{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  width: 500px;
  border-radius: 15px;
  /*background-color: rgba(0,0,0,0.02);*/
}
</style>