import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/bopVipPrice',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/bopVipPrice/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/bopVipPrice',
    method: 'put',
    data
  })
}

export function summary() {
  return request({
    url: 'api/bopVipPrice/listSummary',
    method: 'get'
  })
}


