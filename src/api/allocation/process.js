import request from '@/utils/request'

// 切换流程管理 API proccess
export function getAllProcess(params) { // 切换流程  列表
  return request({
    url: '/rs/dr/drmSwitchingProcess/getAllProcess',
    method: 'post',
    params
  })
}

export function findApproveTempkate(params) { // 审批模板 下拉框 数据
  return request({
    url: '/rs/dr/approveTemplateManager/findApproveTempkate',
    method: 'get',
    params
  })
}

export function findAllUser(data) { // 负责人 下拉框 数据
  return request({
    url: '/rs/dr/system/usermanager/findAllUser',
    method: 'post',
    data
  })
}

export function insert(data) { // 新增
  return request({
    url: '/rs/dr/drmSwitchingProcess/insert',
    method: 'post',
    data
  })
}

export function update(data) { // 修改
  return request({
    url: '/rs/dr/drmSwitchingProcess/update',
    method: 'post',
    data
  })
}

export function submission(params) { // 提交
  return request({
    url: '/rs/dr/drmSwitchingProcess/submission',
    method: 'get',
    params
  })
}

export function deletes(params) { // 删除
  return request({
    url: '/rs/dr/drmSwitchingProcess/delete',
    method: 'get',
    params
  })
}

export function getRebut(params) { // 查看驳回意见
  return request({
    url: '/rs/dr/drmSwitchingProcess/getRebut',
    method: 'get',
    params
  })
}

export function enforcement(params) { // 申请执行
  return request({
    url: '/rs/dr/drmSwitchingProcess/enforcement',
    method: 'get',
    params
  })
}

export function findAllToExamine(data) { // 查看
  return request({
    url: '/rs/dr/drmSwitchingProcess/findAllToExamine',
    method: 'get',
    data
  })
}
// 切换流程管理 API proccess
