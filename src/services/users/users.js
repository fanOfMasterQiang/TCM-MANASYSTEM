import { stringify } from 'qs';
// import Config from '../config';
import request from '@/utils/request';

export async function queryUsers(params) {
  return request(`/api/user/query?${stringify(params)}`,{
    expirys:false
  });
}

export async function queryKey(params) {
  return request(`/api/user/key?${stringify(params)}`,{
    expirys:false
  });
}

export async function addUser(params) {
  return request(`/api/user/add`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function changeUser(params) {
  return request(`/api/user/change`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function delUser(params) {
  return request(`/api/user/del`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}




export async function queryRelate(params) {
  return request(`/api/user/queryRelate?${stringify(params)}`,{
    expirys:false
  });
}

export async function queryRest(params) {
  return request(`/api/user/queryRest?${stringify(params)}`,{
    expirys:false
  });
}

export async function changeRelate(params) {
  return request(`/api/user/changeRelate`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}


