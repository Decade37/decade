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
        <a-avatar shape="square" size="large" :src=img style="margin-left: 70px;margin-bottom: 12px"/>
      </router-link>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 20px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '460px' }">
        <a-page-header
            style=""
            sub-title="返回"
            @back="exit"
        />
<!--        <h2 style="font-weight: bold">上网时，为什么感觉现代人除了我全都很懂编程或计算机？</h2>-->
        <h2 style="font-weight: bold">{{question_title}}</h2>
        <p style="font-size: 15px">
        {{question_content}}
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
  name: "writeAnswer",
  data(){
    return{
      form:{
        text:'',
      },
      searchItem:'',
      id:this.$route.params.id,
      question_title:this.$route.params.question_title,//问题标题
      question_content:this.$route.params.question_content,//问题内容
      question_id:this.$route.params.question_id,
      img:this.$route.params.img,
      token:this.$route.params.token,
      count:'',
    }
  },//end data
  mounted() {
    var _this = this;
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
    exit(){
      var _this = this;
      _this.$router.push({
        path:'/detailpage',
        name:'DatailPage',
        params:{
          id:_this.id,
          img:_this.img,
          token:_this.token,
          question_id:_this.question_id,
          question_state:0,
          question_title:_this.question_title,
          question_content:_this.question_content,
        }
      })
    },

    submitForm(formName){
      var _this = this;
      _this.$axios.post('/api/answer/addAnswer',
        _this.$qs.stringify({
          answerContent: _this.form.text,
          questionId: _this.question_id,
          token:_this.token,
          userId:_this.id,
        }),
          { headers: { access_token: _this.token } }
      ).then(function (response) {
        console.log("请求成功");
        console.log(response.data);
        _this.$message.success('成功提交回答');
        _this.$router.push({
          path:'/detailpage',
          name:'DatailPage',//路由命名
          params:{
            question_id:_this.question_id,//页面之间的传值
            id:_this.id,
            img:_this.img,
            token:_this.token,
            question_state:0,
          },
        });
      }).catch(function (error){
        console.log(error);
        console.log(formName.text);
        _this.$message.error('请求失败，请重新提交回答');
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
  }//end methods
}
</script>

<style scoped>

</style>