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
        <a-avatar shape="square" size="large" icon="user" style="margin-left: 70px;margin-bottom: 12px"/>
      </router-link>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 20px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '460px' }">
        <!--        <h2 style="font-weight: bold">上网时，为什么感觉现代人除了我全都很懂编程或计算机？</h2>-->
        <h2 style="font-weight: bold">{{question_title}}</h2>
        <p style="font-size: 15px">
          无论在知乎QQ微博贴吧还是b站，感觉遇到的所有人都能对编程侃侃而谈，日常谈论的所有话里面都包含各种各样的我从来没见过的专业名词和缩写，每个人都精通至少两个编程语言……但据他们所说这些东西都是最普通的常识而已………是不是现在编程与计算机已经成为了大众的普遍技能？我是被时代淘汰了吗？看其他人聊天就像古代人穿越到现代一样
        </p>
        <a-divider/>
        <a-form-model :model="form" form="form">
          <a-textarea v-model="form.text" placeholder="请输入你的回答" :rows="9" />
          <br/><br/>
          <a-button type="primary" style="float: right" @click="submitForm('form')">提交回答</a-button>&nbsp;
        </a-form-model>
      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Q&A ©2020 Created by syzc
    </a-layout-footer>
  </a-layout>
</template>

<script>
export default {
  name: "alterAnswer",
  data(){
    return{
      searchItem:'',
      form:{
        text:'',
        id:this.$route.params.id,//从登陆界面进行传值
        img:this.$route.params.img,
      },
      id:this.$route.params.id,//从登陆界面进行传值
      img:this.$route.params.img,
      token:this.$route.params.token,
      question_title:'上网时，为什么感觉现代人除了我全都很懂编程或计算机？',//问题标题
      question_content:'真不错',//问题内容,使用router传值
      count:'',
    }
  },//end data
  mounted() {
    var _this = this;
    _this.$axios.post('/api/select',
        _this.$qs.stringify({
          question_id: _this.question_id,//通过router传值
        })
    ).then(function (response) {
      console.log("请求成功");
      console.log(response.data);
      _this.question_id = response.data.question_id;
      _this.question_content = response.data.question_content;
      _this.question_state = response.data.data().question_state;//看看到时候哪个正确
    }).catch(function (error) {
      console.log(error);
      _this.$message.error('请求失败');
    })

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
  },//end getQuestion函数，得到问题的详细信息

  methods:{
    submitForm(formName){
      var _this = this;
      _this.$axios.post('/api/updateAnswer',
          _this.$qs.stringify({
            question_content: formName.text,
            question_id: _this.id,
          })
      ).then(function (response) {
        console.log("请求成功");
        console.log(response.data);
        _this.$message.success('成功修改回答');
        _this.$router.push({
          path:'/detailpage',
          name:'DetailPage',//路由命名
          params:{
            id:_this.id,
          },
        });
      }).catch(function (error){
        console.log(error);
        console.log(formName.text);
        _this.$message.error('修改失败，请重新提交回答');
      })
    },//end submitForm，提交所写的回答

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