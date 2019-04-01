import { stringify } from 'qs';
// import Config from '../config';
import request from '@/utils/request';

export async function queryKey(params) {
  return request(`/api/diagnosis/querySymKey?${stringify(params)}`,{
    expirys:false
  });
}

export async function addSym(params) {
  return request(`/api/diagnosis/addSym`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function changeSym(params) {
  return request(`/api/diagnosis/changeSym`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function delSym(params) {
  return request(`/api/diagnosis/delSym`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}


