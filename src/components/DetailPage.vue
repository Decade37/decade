<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header style="background-color: aliceblue">
      <div style="font-size: 25px;display: inline">
        <router-link :to="{name:'home',params:{'id':this.id,'img':this.img,'token':this.token}}">首页</router-link>
      </div>
      <a-input-search placeholder="请输入要搜索的问题" v-model="searchItem" style="width: 300px;margin-left: 550px;" @search="onSearch" />
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
<!--        问题部分-->
        <a-page-header
            style=""
            sub-title="返回"
            @back="exit"
        />
        <h2 style="font-weight: bold">{{question_title}}</h2>

        <p style="font-size: 15px">{{question_content}}</p>

        <a-button type="primary" v-if="question_state == 0" @click="write"><a-icon type="edit" />写回答</a-button>
<!--        <p v-if="question_state" style="color: red">问题已终结</p>-->
<!--        <p v-else>写回答</p>-->
        <a-button style="margin-left: 200px" v-if="question_state == 0"><a-icon type="heart" /></a-button>
        <a-divider />
<!--        问题部分-->


<!--        回答区-->
        <div v-for="item in answerList" :key="item.answer_id">
          <img :src=item.u_img width="42" height="42">&nbsp;&nbsp;
        <p style="font-weight: bold;font-size: 15px;display: inline">{{item.u_name}}</p>
          <br/><br/>
          {{item.answer_content}}
          <br/><br/>
          <a-button type="primary" @click="like(item)"><a-icon type="like" /></a-button>&nbsp;
          <a-button type="primary" @click="dislike(item)"><a-icon type="dislike" /></a-button>
          <a-button type="primary" style="margin-left: 100px" @click="info(item)"><a-icon type="message" theme="twoTone" />评论</a-button>
          <a-divider/>
        </div>
<!--        回答区-->

        </div>
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Q&A ©2020 Created by syzc
    </a-layout-footer>
  </a-layout>
</template>
<script>
export default {
  name:"main",
  data(){
    return{
      question_title:this.$route.params.question_title,//问题标题
      question_content:this.$route.params.question_content,//问题内容
      question_id: this.$route.params.question_id,//路由传值
      question_state:this.$route.params.question_state,//问题状态
      answerList:[],
      answerId:'',
      replyList:[],
      a_id:3,
      reply:'',//回复内容
      searchItem:'',//搜索的内容
      id:this.$route.params.id,//从登陆界面进行传值
      img:this.$route.params.img,
      token:this.$route.params.token,
      count:'',
      ifToken:localStorage.getItem('access_token'),
    }
  },
  mounted() {
    var _this = this;

    _this.$axios.post('/api/answer/showAnswerByTime',
        _this.$qs.stringify({
          questionId:_this.question_id,
        }),{headers:{access_token:_this.token}}
    ).then(function (response) {
      console.log("请求成功");
      console.log(response.data);
      if(response.data.code == -1)
        _this.$message.info('该问题还没有回答');
      else
        _this.answerList = response.data.data;
    }).catch(function (error) {
      console.log(error);
      alert("请求失败");
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
    exit(){
      var _this = this;
      _this.$router.push({
        path:'/',
        name:'home',
        params:{
          id:_this.id,
          img:_this.img,
          token:_this.token,
        }
      })
    },

    write(){
      var _this = this;
      _this.$router.push({
        path:'/write',
        name:'writeAnswer',//路由命名
        params:{
          question_id:_this.question_id,//页面之间的传值
          id:_this.id,
          img:_this.img,
          token:_this.token,
          question_title:_this.question_title,
          question_content:_this.question_content,
          question_state:_this.question_state,
        },
      });
    },//end write函数，写回答

    like(record){
      var _this = this;
      //console.log(record);
      _this.$axios.post('/api/answer/alterAnswerEvaluationState',
        _this.$qs.stringify({
          answerId: record.answer_id,//回答编号
          uId: record.user_id,//用户账号
          operatorId: _this.id,//操作者账号？？？？？需要进行修改
          evaluationState: 4,//回答被赞
        }),{ headers: { access_token: _this.token } }
      ).then(function (response) {
          console.log(response);
          if(response.data.code == 90)
            _this.$message.error('不能进行重复操作');
          else if(response.data.code == 90000)
            _this.$message.error('请先登录再对该回答进行操作');
          else
            _this.$message.success('点赞成功');
        }).catch(function (error) {
          console.log(error);
          _this.$message.error('请求失败');
        })//end catch异常
    },//end like函数，赞回答

    dislike(record){
      var _this = this;
      _this.$axios.post('/api/answer/alterAnswerEvaluationState',
          _this.$qs.stringify({
            answerId: record.answer_id,//回答编号
            uId: record.user_id,//用户账号
            operatorId: _this.id,//操作者账号？？？？？需要进行修改
            evaluationState: 5,//回答被赞
          }),{ headers: { access_token: _this.token } }
      ).then(function (response) {
            console.log(response.data);
            if(response.data.code == 90)
              _this.$message.error('不能进行重复操作');
            else if(response.data.code == 90000)
              _this.$message.error('请先登录再对该回答进行操作');
            else
              _this.$message.success('点踩成功');
          }).catch(function (error) {
            console.log(error);
            _this.$message.error('请求失败');
          })//end catch异常
    },//end dislike函数。踩回答

    showReplyByTime(answer_id){
      var _this = this;
      _this.$axios.post( '/api/showReplyByTime',
          _this.$qs.stringify({
            answer_id: answer_id,
          })
      ).then(function (response) {
        console.log(response.data);
        _this.replyList = response.data.data();
      }).catch(function (error) {
        console.log(error);
        _this.$notification.error({
          message: '请求失败',
          // description: '',
        });
      })
    },//end showReplyByTime函数，按照时间顺序展示回复

    info(record) {
      var _this = this;
      _this.$router.push({
        path: '/getComments',
        name: 'getComments',//路由命名
        params: {
          question_title:_this.question_title,
          answer_content:record.answer_content,
          answer_id:record.answer_id,
          id:_this.id,
          img:_this.img,
          token:_this.token,
          question_id:_this.question_id,
          question_state:_this.question_state,
          question_content: _this.question_content,
        },
      })
    },//end info函数，提供弹窗功能

    addReply(formName){
      var _this = this;
      _this.$axios.post('/api/addAnswer',
          _this.$qs.stringify({
            answerId: _this.answerId,
            userId:2,//使用router
            replyContent:_this.reply,
          })
      ).then(function (response) {
        console.log("请求成功");
        console.log(response.data);
        _this.$message.success('成功提交评论');
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
        _this.$message.error('请求失败，请重新提交评论');
      })
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
<style lang="less" scoped>

</style>
