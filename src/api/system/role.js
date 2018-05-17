import request from '@/utils/request'

// 角色管理 API role
export function retrieve(params) { // 角色列表
  return request({
    url: '/rs/dr/system/rolemanager/retrieve',
    method: 'get',
    params
  })
}

export function creat(data) { // 添加角色
  return request({
    url: '/rs/dr/system/rolemanager/creat',
    method: 'post',
    data
  })
}

export function update(data) { // 修改角色
  return request({
    url: '/rs/dr/system/rolemanager/update',
    method: 'post',
    data
  })
}
// 角色管理 API role
