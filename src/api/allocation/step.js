import request from '@/utils/request'

// 切换步骤管理 API step
export function getallStep(params) { // 切换步骤  列表
  return request({
    url: '/rs/dr/drmSwitchingStep/getallStep',
    method: 'get',
    params
  })
}

export function disaster(params) { // 灾难恢复计划 下拉框 数据
  return request({
    url: '/rs/dr/drmSwitchingStep/disaster',
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

export function superStep(params) { // 所有步骤 下拉框 数据
  return request({
    url: '/rs/dr/drmSwitchingStep/superStep',
    method: 'get',
    params
  })
}

export function insert(data) { // 新增
  return request({
    url: '/rs/dr/drmSwitchingStep/insert',
    method: 'post',
    data
  })
}

export function update(data) { // 修改
  return request({
    url: '/rs/dr/drmSwitchingStep/update',
    method: 'post',
    data
  })
}
// 切换步骤管理 API step
