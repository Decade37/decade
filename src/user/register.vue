<template>
  <div id="box">
    <div id="RegisterText">注册</div>
    <br>
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
      <a-form-model-item has-feedback label="昵称" prop="username">
        <a-input v-model="ruleForm.username" type="text" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="密码" prop="pass">
        <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="确认密码" prop="checkPass">
        <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
      </a-form-model-item>
      <a-form-model-item has-feedback label="邮箱" prop="email">
        <a-input v-model="ruleForm.email" type="email" />
      </a-form-model-item>
<!--      <a-form-model-item label="邮箱验证码" prop="captcha">-->
<!--        <a-input v-model="ruleForm.captcha" style="width: 150px" type="text" autocomplete="off" />-->
<!--        <a-button style="margin-left: 10px">获取验证码</a-button>-->
<!--      </a-form-model-item>-->
      <a-form-model-item :wrapper-col="{ span: 16, offset: 6 }" style="margin-left: 20px;">
        <a-button type="primary" @click="submitForm('ruleForm')" class="login-form-button">
          注册
        </a-button>
        或者
        <router-link to="/login">有账号，立即登录!</router-link>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
export default {
  name:"register",
  data() {
    let checkEmail = (rule,value,callback) =>{
      let reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
      if(value && !reg.test(value)){
        callback('输入的邮箱无效！');
      }else{
        callback();
      }
    };
    let checkUsername = (rule,value,callback) =>{
      let reg = /^[A-Za-z]+$/;
      if(value && !reg.test(value)){
        callback('输入的用户名无效！（用户名必须由英文字母组成）');
      }else{
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入的密码不同!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        email:'',
        username:'',
        captcha:''
      },
      rules: {
        pass: [
          {required: true,message:'请输入密码',trigger: 'change'},
          {min: 6,message: '请输入六位数及以上的密码',trigger: 'change'},
          { validator: validatePass, trigger: 'change' }
        ],
        checkPass: [
          {required: true,message:'请再次输入密码',trigger: 'change'},
          { validator: validatePass2, trigger: 'change' }
        ],
        email:[
          { required: true, message: '请输入邮箱', trigger: 'change' },
          { validator: checkEmail,trigger: 'change'},
        ],
        username:[
          {required: true, message:'请输入昵称', trigger: 'change'},
          {validator: checkUsername, trigger: 'change'}
        ],
        captcha:[
          {required: true, message:'请输入邮箱验证码', trigger:'change'},
        ]
      },
      layout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 },
        },
      },
    };
  },
  methods: {
    submitForm(formName) {
      var _this = this;
      console.log(this.ruleForm);
      console.log(formName);
      this.$refs[formName].validate(valid => {
        if (valid) {
          //this.$message.success('恭喜您，注册成功');
          this.$axios.post('/api/user/register',
            this.$qs.stringify({
              uName: this.ruleForm.username,
              uEmail: this.ruleForm.email,
              uPwd: this.ruleForm.pass,
            })
          ).then(function (response) {
            console.log(response.data);
            //alert('注册成功');
            if(response.data.ok)
            {
              _this.$message.success('注册成功');
              _this.$router.push({
                path:'/login',
                name:'login',//路由命名
                params:{}
              })
            }
            else
            {
              _this.$message.error(response.data.msg);
            }
          }).catch(function (error) {
            console.log(error);
            _this.$message.error('对不起，注册失败');
          })
        } else {
          console.log('注册失败!!');
          //this.$message.error('对不起，注册失败');
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
#box{
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);
  width: 500px;
  border-radius: 15px;
  background-color:rgba(0,0,0,0.02);
}
#RegisterText {
  text-align: center;
  margin-top: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgb(240, 240, 245);
  font-size: 20px;
}
.login-form-button {
  width: 100%;
}
</style>
