import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/bopUser',
    method: 'post',
    data
  })
}

export function del(uid) {
  return request({
    url: 'api/bopUser/' + uid,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/bopUser',
    method: 'put',
    data
  })
}

export function grant(data) {
  return request({
    url: 'api/bopUser/grant',
    method: 'post',
    data
  })
}

