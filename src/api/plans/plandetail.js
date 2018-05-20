import request from '@/utils/request'

// 预案查看 API plandetail
export function findPreplan(data) { // 预案 列表
  return request({
    url: '/rs/dr/preplanManager/findPreplan',
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
// 预案查看 API plandetail
