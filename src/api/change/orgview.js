import request from '@/utils/request'

// 指挥组织架构 API orgview
export function findAllGroupCascadeUser(params) {
  return request({
    url: '/rs/dr/groupUserManager/findAllGroupCascadeUser',
    method: 'post',
    params
  })
}
// 指挥组织架构 API orgview
