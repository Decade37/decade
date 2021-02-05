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
<!--      <router-link to="personSpace">-->
      <router-link :to="{name:'personSpace',params:{'id':this.id,'img':this.img,'token':this.token,'token':this.token}}">
        <a-avatar shape="square" size="large" :src="img" style="margin-left: 50px;margin-bottom: 12px"/>
      </router-link>
    </a-layout-header>
    <a-layout-content style="padding: 0 50px">
      <a-breadcrumb style="margin: 20px 0">
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '430px' }">
        <img :src=img width="50" height="50">
        <h3 style="font-weight: bold;display: inline;margin-left: 20px;">
          {{username}}
        </h3>
        <a-button style="margin-left: 50px" @click="exit" type="danger">
          退出登录
        </a-button>
        <router-link :to="{name:'changeInfomation',params:{'id':this.id,'img':this.img,'token':this.token}}">
          <a-button style="float: right">编辑个人资料</a-button>
        </router-link>
        <br/><br/>

        <a-menu v-model="answer" mode="horizontal">
          <a-menu-item key="answer" style="width: 330px; text-align: center;font-weight: bold"> 回答</a-menu-item>
<!--          <a-menu-item key="star" style="width: 330px; text-align: center;font-weight: bold"> 收藏</a-menu-item>-->
          <a-menu-item key="question" @click="question" style="width: 330px; text-align: center;font-weight: bold"> 提问</a-menu-item>
        </a-menu>

        <!--依次类推的话，以传来的列表list中的question_id为key，依次显示各个问题，具体如下-->
        <div v-for="item in list" :key="item.question_id">
          <br/><br/>
          <a style="font-weight: bold;font-size: 20px;color: black" @click="seeThisQuestion(item)">{{item.question_title}}</a><!--问题标题-->
          <p>{{item.answer_content}}</p><!--问题内容-->
<!--          {{item.question_authority_state}}&lt;!&ndash;问题的权限部分，到时候再对格式进行调整，因为现在没有样板&ndash;&gt;-->
          <a-button @click="changeAnswer(item)" type="primary" v-if="item.question_authority_state == 0">修改回答</a-button>
          <a-button @click="deleteAnswer(item)" style="margin-left: 50px" type="danger" v-if="item.question_authority_state == 0">删除回答</a-button>
          <p style="color: red" v-if=item.question_authority_state>问题已终结</p>
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
  name:"personSpace",
  inject:['reload'],
  data(){
    return{
      current: ['mail'],
      username:'',//昵称
      id:this.$route.params.id,//从登陆界面进行传值
      img:this.$route.params.img,
      token:this.$route.params.token,
      list: [],
      searchItem:'',
      count:'',
    }
  },
  mounted() {
    var _this = this;
    _this.$axios.post('/api/answer/showAnswerByUserId',
        _this.$qs.stringify( {
          userId: _this.$route.params.id,
          // userId: 2,
        }),{ headers: { access_token: _this.token } }
    ).then(function (response) {
      console.log(response.data);
      _this.list = response.data.data;
    }).catch(function (error) {
      console.log(error);
      _this.$message.error('对不起，请求失败');
    })//end get函数，获取某一个用户的所有回答

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

    getAskedQuestions(){
      var _this = this;
      _this.$axios.post('/api/showQuestByUserId',
        _this.$qs.stringify({
          user_id:_this.userId,
        })
      ).then(function (response) {
        console.log(response.data);
        _this.list = response.data.data;
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('请求失败');
      })
    },//end getAskedQuestions函数，获取该用户的提问

    edit(){
      var _this = this;
      _this.$router.push({
        path:'/changeInfomation',
        name:'changeInfomation',
        params:{
          id:_this.id,
          img:_this.userImg,
          token:_this.token,
        }
      })
    },//end edit函数，编辑个人信息

    question(){
      var _this = this;
      _this.$router.push({
        path:'/personQuestion',
        name:'personQuestion',
        params:{
          id:_this.id,
          img:_this.img,
          token:_this.token,
        }
      })
    },

    changeAnswer(record){
      var _this = this;
      console.log(record);
      _this.$router.push({
        path:'/changeAnswer',
        name:'changeAnswer',
        params:{
          answer_id:record.answer_id,
          answer_content:record.answer_content,
          id:_this.id,
          img:_this.img,
          token:_this.token,
          question_id:record.question_id,
        }
      })
    },//end

    deleteAnswer(record){
      var _this = this;
      _this.$axios.post('/api/answer/deleteAnswer',
          _this.$qs.stringify({
            answerId:record.answer_id,
            isDeleted:1,
          }),{headers: {access_token: _this.token}}
      ).then(function (response) {
        console.log(response.data);
        _this.$message.success('删除成功');
        _this.list = response.data.data;
        _this.reload();
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('删除失败');
      })
    },

    exit(){
      var _this = this;
      _this.$axios.post('/api/user/leave',
        _this.$qs.stringify({
          uId: this.id,
        }),{headers: {access_token:_this.token}}
      ).then(function (response) {
        console.log(response.data);
        localStorage.removeItem('access_token');
        localStorage.clear();
        _this.$router.push({
          path:'/login',
          name:'login',
        })
      }).catch(function (error) {
        console.log(error);
        _this.$message.error('请求失败');
      })
    },//end exit函数

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
          question_state:record.question_authority_state,
          question_title:record.question_title,
          question_content:record.question_content,
        },
      });
    },//end seeThisQuestion函数，查看这个问题的详细信息
  }
}
</script>
<style>

</style>
