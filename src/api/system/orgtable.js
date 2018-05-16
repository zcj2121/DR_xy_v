import request from '@/utils/request'
// 组织架构管理 API orgtable
export function orgtableList(data) { // 成员列表
  return request({
    url: '/rs/dr/groupUserManager/findPersonByName',
    method: 'post',
    data
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

export function findAllUserInRoleEnable() { // 所有成员 下拉框数据
  return request({
    url: '/rs/dr/system/usermanager/findAllUserInRoleEnable',
    method: 'post'
  })
}

export function saveOrUpdateGroup(data) { // 添加 修改 组织
  return request({
    url: '/rs/dr/groupManager/saveOrUpdateGroup',
    method: 'post',
    data
  })
}

export function deleteGroupById(params) { // 删除 组织
  return request({
    url: '/rs/dr/groupManager/deleteGroupById',
    method: 'post',
    params
  })
}

export function findGroupById(params) { // 请求组织名称
  return request({
    url: '/rs/dr/groupManager/findGroupById',
    method: 'post',
    params
  })
}

// 组织架构管理 API orgtable
