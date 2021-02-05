<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header style="background-color: aliceblue">
      <!--      <a>-->
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
        <a-form-model :model="form" form="form">
          <a-textarea v-model="title" placeholder="请写下你的问题" :rows="2" />
          <br/>
          <br/>
          <a-textarea v-model="content" placeholder="请写下问题的内容（即对问题的说明）" :rows="9" />
          <br/><br/>
          <a-button type="primary" style="float: right" @click="submitForm('form')">提交问题</a-button>&nbsp;
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
  name: "addAnswer",
  data(){
    return{
      content:'',
      searchItem:'',
      title:'',
      //title:'你好鸭',
      id:this.$route.params.id,//从登陆界面进行传值
      img:this.$route.params.img,
      token:this.$route.params.token,
      count:'',
    }
  },
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
    submitForm(formName){
      var _this = this;
      _this.$axios.post('/api/quest/addQuest',
          _this.$qs.stringify({
            userId:_this.id,
            questionContent: _this.content,
            questionTitle: _this.title,
          }),{headers:{access_token:_this.token}}
      ).then(function (response) {
        // console.log("请求成功");
        console.log(response.data);
        if(response.data.code == -1)
          _this.$message.info('该问题已经有用户提出！');
        else if(response.data.code == 90000)
          _this.$message.error('请填写问题的具体描述');
        else
        {
          _this.$message.success('提问成功！请耐心等待回复');
          _this.$router.push({
            path:'/',
            name:'home',//路由命名
            params:{
              id:_this.id,
              img:_this.img,
              token:_this.token,
            }
          });
        }
      }).catch(function (error){
        console.log(error);
        console.log(formName.text);
        _this.$message.error('提交失败，请尝试重新提交');
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