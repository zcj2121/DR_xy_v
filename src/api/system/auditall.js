import request from '@/utils/request'

// 审批流程配置 API auditall
export function findAllUserInRoleEnable(params) { // 没被停用的用户 下拉框数据
  return request({
    url: '/rs/dr/system/usermanager/findAllUserInRoleEnable',
    method: 'get',
    params
  })
}

export function saveApproveTemplate(data) { // 添加
  return request({
    url: '/rs/dr/approveTemplateManager/saveApproveTemplate',
    method: 'post',
    data
  })
}

export function updateApproveTemplate(data) { // 修改
  return request({
    url: '/rs/dr/approveTemplateManager/updateApproveTemplate',
    method: 'post',
    data
  })
}

export function findApproveTempkate(data) { // 审批流程配置 列表
  return request({
    url: '/rs/dr/approveTemplateManager/findApproveTempkate',
    method: 'post',
    data
  })
}
// 审批流程配置 API auditall
