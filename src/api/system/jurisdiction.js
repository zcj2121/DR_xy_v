import request from '@/utils/request'

// 权限管理 API jurisdiction
export function retrieve() { // 角色列表
  return request({
    url: '/rs/dr/system/rolemanager/retrieve',
    method: 'get'
  })
}

export function menuAPI() { // 查询 所有菜单数据 树
  return request({
    url: '/rs/dr/system/menu/getMenus',
    method: 'get'
  })
}

export function retrieveActive(params) { // 菜单数据 树 被选中的 树
  return request({
    url: '/rs/dr/system/authority/retrieve',
    method: 'get',
    params
  })
}

export function update(params) { // 保存 菜单数据 树
  return request({
    url: '/rs/dr/system/authority/update',
    method: 'get',
    params
  })
}
// 权限管理 API jurisdiction
