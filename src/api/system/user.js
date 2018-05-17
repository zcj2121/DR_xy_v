import request from '@/utils/request'

// 用户管理 API user
export function retrieve(params) { // 用户列表
  return request({
    url: '/rs/dr/system/usermanager/retrieve',
    method: 'get',
    params
  })
}

export function retrieveRole(params) { // 角色列表
  return request({
    url: '/rs/dr/system/rolemanager/retrieve',
    method: 'get',
    params
  })
}

export function creat(data) { // 添加用户
  return request({
    url: '/rs/dr/system/usermanager/creat',
    method: 'post',
    data
  })
}

export function update(data) { // 修改用户
  return request({
    url: '/rs/dr/system/usermanager/update',
    method: 'post',
    data
  })
}
// 用户管理 API user
