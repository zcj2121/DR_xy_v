import request from '@/utils/request'

// 预案演练 API plandrill
export function findPreplan(params) { // 预案 列表
  return request({
    url: '/rs/dr/preplanManager/findPreplan',
    method: 'post',
    params
  })
}

export function findAllExecutionByPreplanId(params) { // 所有 预案演练 操作
  return request({
    url: '/rs/dr/preplanManager/findAllExecutionByPreplanId',
    method: 'get',
    params
  })
}
// 预案演练 API plandrill