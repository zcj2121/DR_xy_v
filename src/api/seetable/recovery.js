import request from '@/utils/request'

// 恢复计划管理 API recovery
export function retrieve(params) { // vbs资源 列表
  return request({
    url: '/rs/dr/system/vbsmanager/retrieve',
    method: 'get',
    params
  })
}
// 恢复计划管理 API recovery
