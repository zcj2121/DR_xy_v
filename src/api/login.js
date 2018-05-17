import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/dr/loginCheck.do',
    method: 'get',
    params: { username, password }
  })
}

export function getInfo(token) {
  return request({
    url: '/dr/getLoginUserVbs.do',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/dr/logoutVbs.do',
    method: 'get'
  })
}

export function menuItem() {
  return request({
    url: '/dr/data/vbsmenu.do',
    method: 'get'
  })
}

