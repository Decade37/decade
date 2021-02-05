import axios from 'axios'
import Modal from 'ant-design-vue/es/modal'
import notification from 'ant-design-vue/es/notification'
// import store from '@/store'
import store from '../store'
import Qs from 'qs'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_HOST,
  baseURL:'http://localhost:8080',
  timeout: 6000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest'
  },
  transformRequest: [
    function(data) {
      // 在请求之前对data传参进行格式转换
      return Qs.stringify(data)
    }
  ]
})

// request interceptor
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['access_token'] = token
  }
  return config
}, () => {})

// response interceptor
request.interceptors.response.use((response) => {
  const res = response.data

  if (res.code !== 0) {
    if (res.code === 50003 || res.code === 50004) {
      // to re-login
      Modal.confirm({
        'title': '系统提示',
        'content': '您当前登录已失效，请重新登录或退出',
        'ok-text': '重新登录',
        'cancel-text': '取消',
        'onOk': () => {
          store.dispatch('ResetToken').then(() => {
            location.reload()
          })
        }
      })
    } else {
      notification.error({
        message: 'ERROR',
        description: res.msg || 'UNKNOWN'
      })
    }
    return Promise.reject(new Error(res.msg || 'Error'))
  } else {
    return res
  }
}, () => {})

export default request
