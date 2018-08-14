import request from '@/utils/request'

export function login(email, password) {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      email,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/admin/me',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'get'
  })
}
