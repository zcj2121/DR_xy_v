import request from '@/utils/request'

// 切换流程执行历史 API history
export function getAllImplement(params) { // 预案 列表
  return request({
    url: '/rs/dr/drmProcessExecution/getAllImplement',
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
// 切换流程执行历史 API history
