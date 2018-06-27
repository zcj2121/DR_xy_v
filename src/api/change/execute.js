import request from '@/utils/request'

// 切换流程执行 API execute
// export function getExecutionProcess(params) { // 切换流程执行 列表
//   return request({
//     url: '/rs/dr/drmProcessExecution/getExecutionProcess',
//     method: 'get',
//     params
//   })
// }

export function getExecutionProcess(params) { // 切换流程执行 列表
  return request({
    url: 'dr/switchingProcess/getExecutionProcess.do',
    method: 'get',
    params
  })
}

export function getAll(params) { // 查看详情
  return request({
    url: '/rs/dr/drmProcessExecution/getAll',
    method: 'get',
    params
  })
}

export function bigScreen(params) { // 查看大屏数据
  return request({
    url: '/rs/dr/drmProcessExecution/getAll',
    method: 'get',
    params
  })
}
// 切换流程执行 API execute
