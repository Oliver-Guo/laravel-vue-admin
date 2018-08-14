import request from '@/utils/request'

export function getRsSearchArticle(keyword) {
  return request({
    url: '/admin/article/rs_search/' + keyword,
    method: 'get'
  })
}
