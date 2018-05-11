import request from '@/utils/request'

export function getList(params) {
  return request({
    baseURL: 'vbs',
    url: '/vbstable/query',
    method: 'get',
    params
  })
}

export function getListAll(params) {
  return request({
    baseURL: 'vbs',
    url: '/vbstableall/query',
    method: 'get',
    params
  })
}

export function getListDetail(params) {
  return request({
    baseURL: 'vbs',
    url: '/vbstableall/query',
    method: 'get',
    params
  })
}

export function getList1(params) {
  return request({
    url: '/rs/dr/system/vbsmanager/retrieve',
    method: 'get',
    params
  })
}
