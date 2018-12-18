import request from '@/utils/request'
import objectToFormData from 'object-to-formdata'

export function getList(query) {
  return request({
    url: '/admin/author',
    method: 'get',
    params: query
  })
}

export function postAuthor(query, file) {
  const formData = objectToFormData(query)

  if (file !== false) {
    formData.append('file[author]', file)
  }

  return request({
    url: '/admin/author',
    method: 'post',
    data: formData
  })
}

export function getAuthor(id) {
  return request({
    url: '/admin/author/' + id,
    method: 'get'
  })
}

export function delAuthor(id) {
  return request({
    url: '/admin/author/' + id,
    method: 'post',
    data: { _method: 'DELETE' }
  })
}

export function putAuthor(id, query, file) {
  const formData = objectToFormData(query)

  formData.append('_method', 'PUT')

  if (file !== false) {
    formData.append('file[author]', file)
  }

  return request({
    url: '/admin/author/' + id,
    method: 'post',
    data: formData
  })
}

export function putAuthorOnline(id, query) {
  query._method = 'PUT'

  return request({
    url: '/admin/author/ch_is_online/' + id,
    method: 'post',
    data: query
  })
}

export function getAuthorSelects() {
  return request({
    url: '/admin/author/selects',
    method: 'get'
  })
}

