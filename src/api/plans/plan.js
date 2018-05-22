import request from '@/utils/request'

// 预案计划 API plan
export function findAllUserInRoleEnable(params) { // 没被停用的用户 下拉框数据
  return request({
    url: '/rs/dr/system/usermanager/findAllUserInRoleEnable',
    method: 'get',
    params
  })
}

export function findPreplanApproveTemplate(params) { // 所有预案的审批模版 下拉框数据
  return request({
    url: '/rs/dr/preplanManager/findPreplanApproveTemplate',
    method: 'get',
    params
  })
}

export function findPreplanCanUseParent(params) { // 已通过的总体预案 下拉框数据
  return request({
    url: '/rs/dr/preplanManager/findPreplanCanUseParent',
    method: 'get',
    params
  })
}

export function uploadPreplanFile(data) { // 预案文档上传
  return request({
    url: '/dr/uploadPreplanFile.do',
    method: 'post',
    data
  })
}

export function downPreplanFile(params) { // 预案文档下载
  return request({
    url: '/dr/downPreplanFile.do',
    method: 'get',
    params
  })
}

export function savePreplan(data) { // 添加
  return request({
    url: '/rs/dr/preplanManager/savePreplan',
    method: 'post',
    data
  })
}

export function updatePreplan(data) { // 修改
  return request({
    url: '/rs/dr/preplanManager/updatePreplan',
    method: 'post',
    data
  })
}

export function findPreplan(data) { // 所有预案  列表
  return request({
    url: '/rs/dr/preplanManager/findPreplan',
    method: 'post',
    data
  })
}

export function findPreplanById(params) { // 查询单条 详情数据
  return request({
    url: '/rs/dr/preplanManager/findPreplanById',
    method: 'get',
    params
  })
}

export function savePreplanExecution(data) { // 查询单条 详情数据
  return request({
    url: '/rs/dr/preplanManager/savePreplanExecution',
    method: 'post',
    data
  })
}

export function changePreplanStatus(data) { // 查询单条 详情数据
  return request({
    url: '/dr/preplan/changePreplanStatus.do',
    method: 'post',
    data
  })
}

// 预案计划 API plan
