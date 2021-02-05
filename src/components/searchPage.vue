<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header style="background-color: aliceblue">
      <div style="font-size: 25px;display: inline;">
        <router-link :to="{name:'home',params:{'id':this.id,'img':this.img,'token':this.token}}">首页</router-link>
      </div>
      <a-input-search placeholder="请输入要搜索的问题" v-model="searchItem" style="width: 300px;margin-left: 550px;" @search="onSearch"/>
      <a-badge :count=count title="通知" v-if=ifToken style="margin-left: 70px">
        <a-icon type="bell" style="font-size: 25px" title="通知" @click="getMessage"/>
      </a-badge>
      <router-link :to="{name:'personSpace',params:{'id':this.id,'img':this.img,'token':this.token}}">
        <a-avatar shape="square" v-if=ifToken size="large" :src=img style="margin-left: 50px;margin-bottom: 12px"/>
      </router-link>

      <a-button style="margin-left: 80px" type="primary" v-if="ifToken == null">
        <router-link to="/login">登录/注册</router-link>
      </a-button>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 20px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '430px' }">

        <!--依次类推的话，以传来的列表list中的question_id为key，依次显示各个问题，具体如下-->
        <div v-for="item in list" :key="item.question_id">
          <a style="font-weight: bold;font-size: 20px;color: black" @click="seeThisQuestion(item)">{{item.question_title}}</a><!--问题标题-->
          <p>{{item.question_content}}</p><!--问题内容-->
          <p style="color: red" v-if=item.question_authority_state>问题已终结</p><!--问题的权限部分，到时候再对格式进行调整，因为现在没有样板-->
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
  name:"searchPage",
  inject:['reload'],
  data(){
    return{
      searchItem:'',
      list:this.$route.params.list,
      id:this.$route.params.id,//从登陆界面进行传值
      img:this.$route.params.img,
      token:this.$route.params.token,
      count:'',
      ifToken:localStorage.getItem('access_token'),
    }
  },
  mounted() {
    var _this = this;
    _this.$axios.post('/api/msg/showMsgNum',
        _this.$qs.stringify({
          userId: _this.$route.params.id,//router传值！！！
        }),{headers:{access_token:_this.token}}
    ).then(function (response) {
      //console.log(response.data.data);
      _this.count = response.data.data;
      //_this.list = response.data.data;
    }).catch(function (error) {
      console.log(error);
      _this.$message.error('获取消息失败');
    })
  },
  methods:{
    seeThisQuestion(record){
      var _this = this;
      console.log(record);//打印问题详细信息
      _this.$router.push({
        path:'/detailpage',
        name:'DatailPage',//路由命名
        params:{
          question_id:record.question_id,//页面之间的传值
          id:_this.id,
          img:_this.img,
          token:_this.token,
          question_title:record.question_title,
          question_content:record.question_title,
        },
      });
    },//end seeThisQuestion函数，查看这个问题的详细信息

    onSearch(){
      var _this = this;
      _this.$axios.post('/api/quest/selectByTitle',
          _this.$qs.stringify({
            questionTitle:_this.searchItem,
          }),{ headers: { access_token: _this.token } }
      ).then(function (response) {
        console.log(response.data.data);
        _this.list = response.data.data;
        _this.reload();
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
