import request from '@/utils/request'

// 切换阶段管理 API stage
export function getAllProcess(params) { // 切换流程  下拉框 数据
  return request({
    url: '/rs/dr/drmSwitchingStage/getAllProcess',
    method: 'post',
    params
  })
}

export function getAllStage(params) { // 切换阶段 列表 数据
  return request({
    url: '/rs/dr/drmSwitchingStage/getAllStage',
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
    url: '/rs/dr/drmSwitchingStage/insert',
    method: 'post',
    data
  })
}

export function update(data) { // 修改
  return request({
    url: '/rs/dr/drmSwitchingStage/update',
    method: 'post',
    data
  })
}
// 切换阶段管理 API stage
