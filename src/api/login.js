import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    },
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'post',
    // params: { token }
    data: {
      token
    },
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
