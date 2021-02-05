<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header style="background-color: aliceblue">
      <div style="font-size: 25px;display: inline">
        <router-link :to="{name:'home',params:{'id':this.id,'img':this.img,'token':this.token}}">首页</router-link>
      </div>
      <a-input-search placeholder="请输入要搜索的问题" v-model="searchItem" style="width: 300px;margin-left: 550px;" @search="onSearch" />
      <a-badge :count="count" title="通知" style="margin-left: 70px">
        <a-icon type="bell" style="font-size: 25px" title="通知" @click="messageNum"/>
      </a-badge>
      <router-link :to="{name:'personSpace',params:{'id':this.id,'img':this.img,'token':this.token}}">
        <a-avatar shape="square" size="large" :src=img style="margin-left: 70px;margin-bottom: 12px"/>
      </router-link>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 20px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '430px' }">
<!--        内容区域-->
        <!--依次类推的话，以传来的列表list中的msg_id为key，依次显示各个消息，具体如下-->
        <div v-for="item in list" :key="item.msg_id">
          {{item.msg_content}}
          <p style="margin-left: 700px;display: inline">{{item.msg_time}}</p>
          <a-button style="margin-left: 50px;" type="danger" @click="deleteMsg(item)">删除消息</a-button>
          <a-divider/>
        </div>
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
  inject:['reload'],
  name:"messagePage",
  data(){
    return{
      list: [],
      count:'',
      user_id:this.$route.params.id,
      id:this.$route.params.id,//从登陆界面进行传值
      img:this.$route.params.img,
      token:this.$route.params.token,
      searchItem:'',
    }
  },
  mounted(){
    var _this = this;
    _this.$axios.post('/api/msg/showMsg',
      _this.$qs.stringify({
        userId: _this.$route.params.id,//router传值！！！
      }),{headers:{access_token:_this.token}}
    ).then(function (response) {
      console.log(response.data);
      _this.list = response.data.data;
      if(response.data.code == -1)
        _this.$message.success('没有消息');
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

    messageNum(){
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

    deleteMsg(record){
      var _this = this;
      _this.$axios.post('/api/msg/deleteMsg',
          _this.$qs.stringify({
            msgId:record.msg_id,
            isDeleted:1,
          }),{headers:{access_token:_this.token}}
      ).then(function (response) {
        console.log(response);
        //_this.count = response.data.data;
        //_this.list = response.data.data;
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('获取消息失败');
      })
      _this.reload()
      // _this.$axios.post('/api/msg/showMsg',
      //     _this.$qs.stringify({
      //       userId: _this.$route.params.id,//router传值！！！
      //     }),{headers:{access_token:_this.token}}
      // ).then(function (response) {
      //   console.log(response.data);
      //   _this.list = response.data.data;
      //   if(response.data.code == -1)
      //     _this.$message.success('没有消息');
      // }).catch(function (error) {
      //   console.log(error);
      //   _this.$message.error('获取消息失败');
      // })
    },
  }
}
</script>
<style>

</style>
