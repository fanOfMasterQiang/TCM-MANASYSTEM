import { stringify } from 'qs';
// import Config from '../config';
import request from '@/utils/request';

// 新增问卷

export async function queryNumber(params) {
  return request(`/api/admin/query?${stringify(params)}&date=${new Date()}`,{
      expirys:false
    });
}

export async function login(params) {
  return request(`/api/admin/login`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function changeNumber(params) {
  return request(`/api/admin/change`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function changePwd(params) {
  return request(`/api/admin/changePwd`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function delNumber(params) {
  return request(`/api/admin/del`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function addNumber(params) {
  return request(`/api/admin/add`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

