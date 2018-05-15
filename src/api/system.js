import request from '@/utils/request'
// 组织架构管理 API orgtable
export function orgtableList(displayName, groupId) { // 成员列表
  return request({
    url: '/rs/dr/groupUserManager/findPersonByName',
    method: 'post',
    params: { displayName, groupId }
  })
}

export function findAllGroupToTree() { // 组织结构树
  return request({
    url: '/rs/dr/groupManager/findAllGroupToTree',
    method: 'post'
  })
}

export function findAllGroup() { // 所有组织 下拉框数据
  return request({
    url: '/rs/dr/groupManager/findGroupLimitFour',
    method: 'post'
  })
}

export function findParentAndAboveNode(groupId) { // 前置节点 父级组织 下拉框数据
  return request({
    url: '/rs/dr/groupManager/findParentAndAboveNode',
    method: 'post',
    params: groupId
  })
}

export function findAllUser() { // 所有成员 下拉框数据
  return request({
    url: '/rs/dr/system/usermanager/findAllUserInRoleEnable',
    method: 'post'
  })
}

// 组织架构管理 API orgtable
