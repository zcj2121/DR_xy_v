import request from '@/utils/request'

// 执行切换审核 API changeaudit
export function getAllProcess(params) { // 执行切换审核 列表
  return request({
    url: '/dr/switchingProcess/getAllProcess.do',
    method: 'get',
    params
  })
}

export function updateStatus(params) { // 审核
  return request({
    url: '/rs/dr/drmProcessExecution/updateStatus',
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
// 执行切换审核 API changeaudit
