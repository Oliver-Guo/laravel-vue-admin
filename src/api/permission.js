import request from '@/utils/request'

export function getRoleList() {
  return request({
    url: '/admin/permission_role',
    method: 'get'
  })
}

export function delRole(id) {
  return request({
    url: '/admin/permission_role/' + id,
    method: 'post',
    data: { _method: 'DELETE' }
  })
}

export function getRolePermissions() {
  return request({
    url: '/admin/permission_role_permissions',
    method: 'get'
  })
}

export function postRole(query) {
  return request({
    url: '/admin/permission_role',
    method: 'post',
    data: query
  })
}

export function getRole(id) {
  return request({
    url: '/admin/permission_role/' + id,
    method: 'get'
  })
}

export function putRole(id, query) {
  query._method = 'PUT'

  return request({
    url: '/admin/permission_role/' + id,
    method: 'post',
    data: query
  })
}

export function getUserList(query) {
  return request({
    url: '/admin/permission_user',
    method: 'get',
    params: query
  })
}

export function delUser(id) {
  return request({
    url: '/admin/permission_user/' + id,
    method: 'post',
    data: { _method: 'DELETE' }
  })
}

export function postUser(query) {
  return request({
    url: '/admin/permission_user',
    method: 'post',
    data: query
  })
}

export function getUser(id) {
  return request({
    url: '/admin/permission_user/' + id,
    method: 'get'
  })
}

export function putUser(id, query) {
  query._method = 'PUT'

  return request({
    url: '/admin/permission_user/' + id,
    method: 'post',
    data: query
  })
}

