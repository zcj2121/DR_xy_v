import request from '@/utils/request'

// 集群资源 API colony
export function retrieve(params) { // vbs资源 列表
  return request({
    url: '/rs/dr/system/vbsmanager/retrieve',
    method: 'get',
    params
  })
}
// 集群资源 API colony
