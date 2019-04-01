import { stringify } from 'qs';
// import Config from '../config';
import request from '@/utils/request';

export async function queryKey(params) {
  return request(`/api/diagnosis/querySynKey?${stringify(params)}`,{
    expirys:false
  });
}

export async function addSyn(params) {
  return request(`/api/diagnosis/addSyn`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function changeSyn(params) {
  return request(`/api/diagnosis/changeSyn`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function delSyn(params) {
  return request(`/api/diagnosis/delSyn`,{
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
  return request(`/api/diagnosis/queryRelate?${stringify(params)}`,{
    expirys:false
  });
}

export async function queryRest(params) {
  return request(`/api/diagnosis/queryRest?${stringify(params)}`,{
    expirys:false
  });
}

export async function changeRelate(params) {
  return request(`/api/diagnosis/changeRelate`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}


