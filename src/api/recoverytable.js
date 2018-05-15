import request from '@/utils/request'

export function getList(params) {
  return request({
    baseURL: 'http://59.110.238.148:3000',
    url: '/vbstable/query',
    method: 'get',
    params
  })
}

export function getListHistory(params) {
  return request({
    baseURL: 'http://59.110.238.148:3000',
    url: '/vbstable/query',
    method: 'get',
    params
  })
}

export function getListDetail(params) {
  return request({
    baseURL: 'http://59.110.238.148:3000',
    url: '/vbstable/query',
    method: 'get',
    params
  })
}
