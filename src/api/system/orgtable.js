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

export function findAllUserInRoleEnable() { // 所有成员 下拉框数据
  return request({
    url: '/rs/dr/system/usermanager/findAllUserInRoleEnable',
    method: 'get'
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
    method: 'get',
    params
  })
}

export function saveOrUpdatePerson(data) { // 添加 修改 成员
  return request({
    url: '/rs/dr/groupUserManager/saveOrUpdatePerson',
    method: 'post',
    data
  })
}

export function deletePersonById(params) { // 删除 成员
  return request({
    url: '/rs/dr/groupUserManager/deletePersonById',
    method: 'post',
    params
  })
}

// 组织架构管理 API orgtable
