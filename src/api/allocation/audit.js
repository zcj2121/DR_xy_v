import request from '@/utils/request'

// 切换流程审批 API audit
export function findAllapproved(params) { // 切换流程审批 列表
  return request({
    url: '/dr/switchingProcess/findAllapproved.do',
    method: 'get',
    params
  })
}

export function updateStatus(params) { // 审批 通过、驳回
  return request({
    url: '/rs/dr/drmSwitchingProcess/updateStatus',
    method: 'get',
    params
  })
}

export function findAllToExamine(params) { // 查看
  return request({
    url: '/rs/dr/drmSwitchingProcess/findAllToExamine',
    method: 'get',
    params
  })
}
// 切换流程审批 API audit
