import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vbstable/query',
    method: 'get',
    params
  })
}

export function getListAll(params) {
  return request({
    url: '/vbstableall/query',
    method: 'get',
    params
  })
}

export function getListDetail(params) {
  return request({
    url: '/vbstableall/query',
    method: 'get',
    params
  })
}
