import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/recoverytable/query',
    method: 'get',
    params
  })
}

export function getListHistory(params) {
  return request({
    url: '/recoverytable/query',
    method: 'get',
    params
  })
}

export function getListDetail(params) {
  return request({
    url: '/recoverytable/query',
    method: 'get',
    params
  })
}
