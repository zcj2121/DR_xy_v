import request from '@/utils/request'

// 预案演练 API plandrill
export function findPreplan(data) { // 预案 列表
  return request({
    url: '/rs/dr/preplanManager/findPreplan',
    method: 'post',
    data
  })
}

export function findAllExecutionByPreplanId(params) { // 所有 预案演练 操作
  return request({
    url: '/rs/dr/preplanManager/findAllExecutionByPreplanId',
    method: 'get',
    params
  })
}

export function getPreplanExecution(params) { // 所有 预案演练 操作
  return request({
    url: '/rs/dr/preplanManager/getPreplanExecution',
    method: 'get',
    params
  })
}

export function finishPreplanTask(params) { // 所有 预案演练 操作
  return request({
    url: '/dr/preplan/finishPreplanTask.do',
    method: 'get',
    params
  })
}
// 预案演练 API plandrill
