import request from '@/utils/request'

// 预案审批 API planaudit
// export function findPreplan(data) { // 预案 列表
//   return request({
//     url: '/rs/dr/preplanManager/findPreplan',
//     method: 'post',
//     data
//   })
// }

export function findPreplan(data) { // 预案 列表
  return request({
    url: '/dr/preplan/findAllPreplanToApproval.do',
    method: 'post',
    data
  })
}

export function findPreplanById(params) { // 查看 详情
  return request({
    url: '/rs/dr/preplanManager/findPreplanById',
    method: 'get',
    params
  })
}

export function updatePreplanState(params) { // 审批
  return request({
    url: '/dr/preplan/updatePreplanState.do',
    method: 'get',
    params
  })
}
// 预案审批 API planaudit
