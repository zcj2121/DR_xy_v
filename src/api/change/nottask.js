import request from '@/utils/request'

// 待办任务 API nottask
export function getAllTask(params) { // 待办任务 列表
  return request({
    url: '/rs/dr/drmSwitchingProcess/getAllTask',
    method: 'get',
    params
  })
}

export function submitArtificial(params) { // 所有 预案演练 操作
  return request({
    url: '/rs/dr/drmSwitchingProcess/submitArtificial',
    method: 'get',
    params
  })
}
// 待办任务 API nottask
