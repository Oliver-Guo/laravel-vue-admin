import request from '@/utils/request'

export function getRsSearchTag(name) {
  return request({
    url: '/admin/tag/rs_search/' + name,
    method: 'get'
  })
}
