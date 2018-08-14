import axios from 'axios'
import store from '@/store'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '@/router'

import swal from 'vue-sweetalert2/node_modules/sweetalert2'
import 'vue-sweetalert2/node_modules/sweetalert2/dist/sweetalert2.min.css'

const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000
})

service.interceptors.request.use(request => {
  if (store.getters.token) {
    request.headers.common['Authorization'] = `Bearer` + getToken()
  }
  return request
})

service.interceptors.response.use(response => {
  const authorization = response.headers['authorization']

  if (authorization !== undefined) {
    const newtoken = authorization.split('Bearer')[1]

    store.commit('SET_TOKEN', newtoken)
    setToken(newtoken)
  }

  // 輸出為空白 代表儲存成功
  if (response.data === '') {
    swal({
      type: 'success',
      title: '儲存成功',
      showConfirmButton: false,
      timer: 1000
    })
  }

  return Promise.resolve(response)
}, error => {
  if (error.response !== undefined) {
    const { status } = error.response

    if (status === 403 && getToken()) {
      // 權限
      if (error.response.data.message === '403 Forbidden') {
        router.push({ name: 'Dashboard' })
        return Promise.reject(error)
      }
      // 使用者操作有誤
      swal({
        type: 'error',
        title: error.response.data.message,
        showConfirmButton: false
      })
      return Promise.reject(error)
    }

    if (status === 422 && getToken()) {
      let error_message = ''
      // error.response.data.errors.forEach(one => {
      //   error_message += (one + '<br>')
      // })

      Object.keys(error.response.data.errors).map(objectKey => {
        error_message += (error.response.data.errors[objectKey][0] + '<br>')
      })
      // 使用者操作有誤
      swal({
        type: 'error',
        title: error_message,
        showConfirmButton: false
      })
      return Promise.reject(error)
    }

    // token 有問題
    if (status === 401) {
      removeToken()
      store.commit('SET_TOKEN', '')
      router.push({ name: 'login' })
    }
  }

  // removeToken()
  // store.commit('SET_TOKEN', '')
  // router.push({ name: 'login' })

  return Promise.reject(error)
})

export default service
