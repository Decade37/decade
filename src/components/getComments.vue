<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header style="background-color: aliceblue">
      <div style="font-size: 25px;display: inline;">
        <router-link :to="{name:'home',params:{'id':this.id,'img':this.img,'token':this.token}}">首页</router-link>
      </div>
      <a-input-search placeholder="请输入要搜索的问题" v-model="searchItem" style="width: 300px;margin-left: 550px;" @search="onSearch"/>
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
            sub-title="返回"
            @back="exit"
        />
        <h2 style="font-weight: bold">{{question_title}}</h2>
        <p style="font-size: 20px;">{{answer_content}}</p>
        <!--依次类推的话，以传来的列表list中的question_id为key，依次显示各个问题，具体如下-->
        <a-divider/>
        <div v-for="item in list" :key="item.reply_id">
          <!--          <h2 style="font-weight: bold">{{item.reply_content}}</h2>&lt;!&ndash;问题标题&ndash;&gt;-->
          <li>{{item.reply_content}}</li><!--问题内容-->
          <!--          {{item.question_authority_state}}&lt;!&ndash;问题的权限部分，到时候再对格式进行调整，因为现在没有样板&ndash;&gt;-->
          <a-divider/>
        </div>
        <a-form-model >
          <a-textarea v-model="reply" placeholder="写下你的回复" :rows="2" />
          <br/><br/>
          <a-button type="primary" @click="addReply">提交回复</a-button>
        </a-form-model>
        <!--end 显示问题列表的部分-->

      </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Q&A ©2020 Created by syzc
    </a-layout-footer>
  </a-layout>
</template>
<script>
export default {
  name:"getComments",
  inject:['reload'],
  data(){
    return{
      list:[],
      reply:'',
      question_title:this.$route.params.question_title,
      question_content:this.$route.params.question_content,
      answer_content:this.$route.params.answer_content,
      answer_id:this.$route.params.answer_id,
      id:this.$route.params.id,//从登陆界面进行传值
      img:this.$route.params.img,
      token:this.$route.params.token,
      searchItem:'',
      question_id:this.$route.params.question_id,
      question_state:this.$route.params.question_state,
      count:'',
    }
  },
  mounted() {
    var _this = this;
    _this.$axios.post('/api/answer/showReplyByTime',
        _this.$qs.stringify({
          answerId:_this.$route.params.answer_id,
        }),{headers:{access_token:_this.token}}
    ).then(function (response) {
      console.log(response.data);
      _this.list = response.data.data;
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
          question_state:_this.question_state,
          question_title:_this.question_title,
          question_content:_this.question_content,
        }
      })
    },

    addReply(){
      var _this = this;
      _this.$axios.post('/api/answer/addReply',
          _this.$qs.stringify({
            answerId: _this.answer_id,
            userId:_this.id,//使用router
            replyContent:_this.reply,
          }),{headers:{access_token:_this.token}}
      ).then(function (response) {
        console.log("请求成功");
        console.log(response.data);
        if(response.data.code == -1)
          _this.$message.error(response.data.msg);
        else
          _this.$message.success('成功提交评论');
        //_this.list = response.data.data;
      }).catch(function (error){
        console.log(error);
        //console.log(formName.text);
        _this.$message.error('请求失败，请重新提交评论');
      })
      _this.reload()
    },//end addReply函数,添加回复

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
<style>

</style>
