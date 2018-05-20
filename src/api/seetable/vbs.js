import request from '@/utils/request'

// vbs资源 API vbs
export function retrieve(params) { // vbs资源 列表
  return request({
    url: '/rs/dr/system/vbsmanager/retrieve',
    method: 'get',
    params
  })
}
// vbs资源 API vbs
