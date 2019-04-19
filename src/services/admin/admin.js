import { stringify } from 'qs';
import Config from '../config';
import request from '@/utils/request';

export async function queryNumber(params) {
  return request(`${Config.service}/api/Admins/getById?${stringify(params)}`,{
      expirys:false
    });
}

export async function queryAll() {
  return request(`${Config.service}/api/Admins/getAll`,{
    expirys:false
  });
}

export async function login(params) {
  return request(`${Config.service}/api/Admins/login`,{
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
  return request(`${Config.service}/api/Admins/update`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

export async function changeProfile(params) {
  return request(`${Config.service}/api/Admins/change`,{
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
  return request(`${Config.service}/api/Admins/changePwd`,{
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
  return request(`${Config.service}/api/Admins/deteByIds`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
    traditional:true
  });
}

export async function addNumber(params) {
  return request(`${Config.service}/api/Admins/add`,{
    method: 'POST',
    body: {
      ...params,
    },
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    },
  });
}

