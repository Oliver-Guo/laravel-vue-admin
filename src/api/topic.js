import request from '@/utils/request'
import objectToFormData from 'object-to-formdata'

export function getTopicCategoryList(query) {
  console.log(query)

  return request({
    url: '/admin/topic_category',
    method: 'get',
    data: query
  })
}

export function putTopicCategoryOnline(id, query) {
  query._method = 'PUT'

  return request({
    url: '/admin/topic_category/ch_is_online/' + id,
    method: 'post',
    data: query
  })
}

export function putTopicCategorySort(query) {
  query._method = 'PUT'

  return request({
    url: '/admin/topic_category/ch_sort',
    method: 'post',
    data: query
  })
}

export function delTopicCategory(id) {
  return request({
    url: '/admin/topic_category/' + id,
    method: 'post',
    data: { _method: 'DELETE' }
  })
}

export function postTopicCategory(query) {
  return request({
    url: '/admin/topic_category',
    method: 'post',
    data: query
  })
}

export function getTopicCategory(id) {
  return request({
    url: '/admin/topic_category/' + id,
    method: 'get'
  })
}

export function putTopicCategory(id, query) {
  query._method = 'PUT'

  return request({
    url: '/admin/topic_category/' + id,
    method: 'post',
    data: query
  })
}

export function getTopicList(query) {
  return request({
    url: '/admin/topic',
    method: 'get',
    params: query
  })
}

export function putTopicOnline(id, query) {
  query._method = 'PUT'

  return request({
    url: '/admin/topic/ch_is_online/' + id,
    method: 'post',
    data: query
  })
}

export function delTopic(id) {
  return request({
    url: '/admin/topic/' + id,
    method: 'post',
    data: { _method: 'DELETE' }
  })
}

export function postTopic(query, file) {
  const formData = objectToFormData(query)

  if (file !== false) {
    formData.append('file[topic]', file)
  }

  return request({
    url: '/admin/topic',
    method: 'post',
    data: formData
  })
}

export function getTopic(id) {
  return request({
    url: '/admin/topic/' + id,
    method: 'get'
  })
}

export function putTopic(id, query, file) {
  const formData = objectToFormData(query)

  formData.append('_method', 'PUT')

  if (file !== false) {
    formData.append('file[topic]', file)
  }

  return request({
    url: '/admin/topic/' + id,
    method: 'post',
    data: formData
  })
}
