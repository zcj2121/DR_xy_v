import request from '@/utils/request'

export function findGroupById(groupId) {
  return request({
    url: '/rs/dr/groupManager/findGroupById',
    method: 'post',
    params: groupId
  })
}

export function findParentAndAboveNode(groupId) {
  return request({
    url: '/rs/dr/groupManager/findParentAndAboveNode',
    method: 'post',
    params: groupId
  })
}

export function findAllGroupToTree() {
  return request({
    url: '/rs/dr/groupManager/findAllGroupToTree',
    method: 'post'
  })
}

