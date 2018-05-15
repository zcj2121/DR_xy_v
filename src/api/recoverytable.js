import request from '@/utils/request'

export function getList(params) {
  return request({
    baseURL: 'http://39.107.118.71:3000',
    url: '/vbstable/query',
    method: 'get',
    params
  })
}

export function getListHistory(params) {
  return request({
    baseURL: 'http://39.107.118.71:3000',
    url: '/vbstable/query',
    method: 'get',
    params
  })
}

export function getListDetail(params) {
  return request({
    baseURL: 'http://39.107.118.71:3000',
    url: '/vbstable/query',
    method: 'get',
    params
  })
}
